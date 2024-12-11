import { OrderStatus } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../../core/ErrorResponse';
import prisma from '../../models';
import ProductService from '../product/product.service';

type OrderData = {
  phone: string;
  shippingAddress: string;
  transProvider: number;

  products: {
    productId: number;
    quantity: number;
    color?: string;
    size?: string;
  }[];
};

type OrderQueries = {
  userId?: number;
  shopId?: number;
  providerId?: number;
  product?: number;
  status?: OrderStatus[];
  createdAfter?: Date;
  createdBefore?: Date;
  minValue?: number;
  maxValue?: number;

  sortBy?: 'createdAt' | 'updatedAt' | 'totalAmount';
  order?: 'asc' | 'desc';

  limit?: number;
  offset?: number;
};

class OrderService {
  private static async calculateOrderValue(
    transportationProviderId: number,
    products: { quantity: number; currentPrice: number }[],
  ) {
    const provider = await prisma.transportationProvider.findUnique({
      where: { providerId: transportationProviderId },
      select: { shippingFee: true },
    });

    if (!provider) {
      throw new NotFoundError('Invalid transportation provider');
    }

    const totalProductCost = products.reduce((acc, product) => {
      return acc + product.currentPrice * product.quantity;
    }, 0);

    return { totalProductCost, shippingFee: provider.shippingFee };
  }

  private static async getOrderProducts(orderData: OrderData) {
    const products = await Promise.all(
      orderData.products.map(({ productId }) =>
        prisma.product.findUnique({
          where: { productId: productId },
        }),
      ),
    );

    if (products.some((product) => product == null)) {
      throw new NotFoundError('Invalid product');
    }

    const filteredProducts = products.filter((product) => product != null);

    return filteredProducts.map((product, index) => ({
      ...product,
      stock: product.quantity,
      quantity: orderData.products[index].quantity,
      color: orderData.products[index].color,
      size: orderData.products[index].size,
    }));
  }

  private static getTotalNoEachProduct(
    orderProducts: { productId: number; quantity: number; stock: number }[],
  ): Map<number, { total: number; stock: number }> {
    return orderProducts.reduce((acc, product) => {
      const { stock, total } = acc.get(product.productId) || {
        stock: product.stock,
        total: 0,
      };
      acc.set(product.productId, {
        total: total + product.quantity,
        stock: stock,
      });
      return acc;
    }, new Map<number, { total: number; stock: number }>());
  }

  static async createOrder(userid: number, productData: OrderData) {
    if (productData.products.length === 0) {
      throw new BadRequestError('Order must contain at least one product');
    }

    const orderProducts = await this.getOrderProducts(productData);

    const shopId = orderProducts[0].sellerId;
    if (orderProducts.some((product) => product.sellerId !== shopId)) {
      throw new BadRequestError('All products must be from the same shop');
    }

    this.getTotalNoEachProduct(orderProducts).forEach(
      ({ total, stock }, productId) => {
        if (total > stock) {
          throw new BadRequestError(
            `Not enough stock for product ${productId}`,
          );
        }
      },
    );

    orderProducts.forEach(async ({ productId, color, size }) => {
      if (
        !(await ProductService.checkProductVariantExists(
          productId,
          color,
          size,
        ))
      )
        throw new BadRequestError(`Invalid variant for product ${productId}`);
    });

    const { totalProductCost, shippingFee } = await this.calculateOrderValue(
      productData.transProvider,
      orderProducts,
    );

    return await prisma.order.create({
      data: {
        customerNumber: productData.phone,
        shippingAddress: productData.shippingAddress,
        shippingFee: shippingFee,
        totalAmount: totalProductCost + shippingFee,

        customer: { connect: { userId: userid } },
        shop: { connect: { shopOwnerId: shopId } },
        transportationProvider: {
          connect: { providerId: productData.transProvider },
        },
        orderProducts: {
          create: orderProducts.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
            color: product.color,
            size: product.size,
            price: product.currentPrice,
            orderDetailNumber: -1,
          })),
        },
      },
    });
  }

  static async getOrderById(orderId: number) {
    const order = await prisma.order.findUnique({
      where: { orderId: orderId },
      include: {
        orderProducts: {
          select: {
            productId: true,
            quantity: true,
            color: true,
            size: true,
            price: true,
          },
        },
        customer: true,
        transportationProvider: {
          select: { providerId: true, providerName: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    const orderWithDetails = await Promise.all(
      order.orderProducts.map(async (product) => {
        const productDetails = await prisma.product.findUnique({
          where: { productId: product.productId },
          select: {
            productName: true,
            productImages: {
              select: {
                image: {
                  select: { url: true },
                },
              },
            },
          },
        });
        return {
          ...product,
          productName: productDetails?.productName,
          productImageUrl: productDetails?.productImages[0].image.url,
        };
      }),
    );

    return {
      ...order,
      orderProducts: orderWithDetails,
    };
  }

  static async getOrders(queries: OrderQueries) {
    const condition = {
      customerId: queries.userId,
      shopId: queries.shopId,
      transProviderId: queries.providerId,
      status: queries.status && { in: queries.status },
      createdAt: {
        gte: queries.createdAfter,
        lte: queries.createdBefore,
      },
      orderProducts: queries.product
        ? {
            some: {
              productId: queries.product,
              price: {
                gte: queries.minValue,
                lte: queries.maxValue,
              },
            },
          }
        : undefined,
      totalAmount: {
        gte: queries.minValue,
        lte: queries.maxValue,
      },
    };

    const [count, orders] = await prisma.$transaction([
      prisma.order.count({
        where: condition,
      }),
      prisma.order.findMany({
        take: queries.limit,
        skip: queries.offset,

        where: condition,

        orderBy: queries.sortBy
          ? {
              [queries.sortBy]: queries.order,
            }
          : undefined,
      }),
    ]);
    return { count, orders };
  }

  private static canUpdateOrderStatus(
    currentStatus: OrderStatus,
    newStatus: OrderStatus,
  ) {
    const ORDER_MAP = new Map<OrderStatus, OrderStatus[]>([
      [
        OrderStatus.PENDING,
        [OrderStatus.CANCELED, OrderStatus.ACCEPTED, OrderStatus.REJECTED],
      ],
      [OrderStatus.CANCELED, []],
      [OrderStatus.REJECTED, []],
      [OrderStatus.ACCEPTED, [OrderStatus.DELIVERING]],
      [OrderStatus.DELIVERING, [OrderStatus.DELIVERED]],
      [OrderStatus.DELIVERED, [OrderStatus.RECEIVED]],
      [OrderStatus.RECEIVED, [OrderStatus.COMPLETED, OrderStatus.RETURNED]],
      [OrderStatus.RETURNED, []],
      [OrderStatus.COMPLETED, []],
    ]);

    return ORDER_MAP.get(currentStatus)?.includes(newStatus);
  }

  private static async getOrderProductQuantity(orderId: number) {
    return (await prisma.$queryRaw`
    SELECT 
      od."productId" as "productId",
      od."quantity" as "quantity",
      p."quantity" as "stock"
    FROM "OrderDetail" od
    JOIN "Product" p ON od."productId" = p."productId"
    WHERE od."orderId" = ${orderId}
  `) as {
      productId: number;
      quantity: number;
      stock: number;
    }[];
  }

  private static async handleStatusTrasitToAccepted(
    orderProducts: { productId: number; quantity: number; stock: number }[],
  ) {
    this.getTotalNoEachProduct(orderProducts).forEach(
      ({ total, stock }, productId) => {
        if (total > stock) {
          throw new BadRequestError(
            `Not enough stock for product ${productId}`,
          );
        }
      },
    );

    orderProducts.forEach(async ({ productId, quantity }) => {
      await prisma.product.update({
        where: { productId: productId },
        data: {
          quantity: { decrement: quantity },
        },
      });
    });
  }

  private static handleStatusTransitToCompleted(
    orderProducts: { productId: number; quantity: number }[],
  ) {
    orderProducts.forEach(async ({ productId, quantity }) => {
      await prisma.product.update({
        where: { productId: productId },
        data: {
          numSoldProduct: { increment: quantity },
        },
      });
    });
  }

  private static async handleStatusTransitToReturned(
    orderProducts: { productId: number; quantity: number }[],
  ) {
    orderProducts.forEach(async ({ productId, quantity }) => {
      await prisma.product.update({
        where: { productId: productId },
        data: {
          quantity: { increment: quantity },
        },
      });
    });
  }

  static async updateOrderStatus(orderId: number, newStatus: OrderStatus) {
    const order = await prisma.order.findUnique({
      where: { orderId: orderId },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (!this.canUpdateOrderStatus(order.status, newStatus)) {
      throw new BadRequestError(
        `Invalid status transition: transit from ${order.status} to ${newStatus}`,
      );
    }

    const orderProducts = await this.getOrderProductQuantity(orderId);

    switch (newStatus) {
      case OrderStatus.ACCEPTED:
        await this.handleStatusTrasitToAccepted(orderProducts);
        break;
      case OrderStatus.RETURNED:
        await this.handleStatusTransitToReturned(orderProducts);
        break;
      case OrderStatus.COMPLETED:
        await this.handleStatusTransitToCompleted(orderProducts);
        break;
    }

    return await prisma.order.update({
      where: { orderId: orderId },
      data: { status: newStatus },
    });
  }
}

export default OrderService;
