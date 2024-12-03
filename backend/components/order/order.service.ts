import { OrderStatus } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../../core/ErrorResponse";
import prisma from "../../models";
import ProductService from "../product/product.service";

type OrderData = {
  shippingAddress: string;
  transProvider: number;

  products: {
    productId: number;
    quantity: number;
    color?: string;
    size?: string;
  }[];
}

type OrderQueries = {
  userId?: number;
  shopId?: number;
  providerId?: number;
  product?: number;
  status?: OrderStatus;
  createdAfter?: Date;
  createdBefore?: Date;
  minValue?: number;
  maxValue?: number;

  orderBy?: 'createdAt' | 'totalAmount';
  order?: 'asc' | 'desc';

  limit?: number;
  offset?: number;
}


class OrderService {

  private static async getOrderProducts(orderData: OrderData) {

    const products = await Promise.all(
      orderData.products.map(({ productId }) => prisma.product.findUnique({
        where: { productId: productId },
      }))
    );

    if (products.some(product => product == null)) {
      throw new NotFoundError("Invalid product");
    }

    const filteredProducts = products.filter(product => product != null);

    return filteredProducts.map((product, index) => ({
      ...product,
      boughtQuantity: orderData.products[index].quantity,
      color: orderData.products[index].color,
      size: orderData.products[index].size
    }))
  }

  private static async calculateOrderValue(transportationProviderId: number, products: any[]) {
    const provider = await prisma.transportationProvider.findUnique({
      where: { providerId: transportationProviderId },
      select: { shippingFee: true }
    });

    if (!provider) {
      throw new NotFoundError("Invalid transportation provider");
    }

    const totalProductCost = products.reduce((acc, product) => {
      return acc + (product as any).currentPrice * product.boughtQuantity;
    }, 0);

    return { totalProductCost, shippingFee: provider.shippingFee };
  }

  private static getTotalNoEachProduct(orderProducts: any[]): Map<number, { total: number, stock: number }> {
    return orderProducts.reduce((acc, product) => {
      const { stock, total } = acc.get(product.productId) || { stock: product.quantity, total: 0 };
      acc.set(product.productId, {
        total: total + product.boughtQuantity,
        stock: stock
      });
      return acc;
    }, new Map<number, { total: number, stock: number }>());
  }

  static async createOrder(userid: number, productData: OrderData) {
    if (productData.products.length === 0) {
      throw new BadRequestError("Order must contain at least one product");
    }

    const orderProducts = await this.getOrderProducts(productData);

    const shopId = orderProducts[0].sellerId;
    if (orderProducts.some(product => product.sellerId !== shopId)) {
      throw new BadRequestError("All products must be from the same shop");
    }

    this.getTotalNoEachProduct(orderProducts)
      .forEach(({ total, stock }, productId) => {
        if (total > stock) {
          throw new BadRequestError(`Not enough stock for product ${productId}`);
        }
      });

    orderProducts.forEach(async ({ productId, color, size }) => {
      if (!(await ProductService.checkProductVariantExists(productId, color, size)))
        throw new BadRequestError(`Invalid variant for product ${productId}`);
    });

    const { totalProductCost, shippingFee } = await this.calculateOrderValue(productData.transProvider, orderProducts);

    return await prisma.order.create({
      data: {
        shippingAddress: productData.shippingAddress,
        shippingFee: shippingFee,
        totalAmount: totalProductCost + shippingFee,

        customer: { connect: { userId: userid } },
        shop: { connect: { shopOwnerId: shopId } },
        transportationProvider: { connect: { providerId: productData.transProvider } },
        orderProducts: {
          create: orderProducts.map(product => ({
            productId: product.productId,
            quantity: product.quantity,
            color: product.color,
            size: product.size,
            price: product.currentPrice,
            product: { connect: { productId: product.productId } }
          })),
        }
      }
    });
  }

  static async getOrderById(orderId: number) {
    return await prisma.order.findUnique({
      where: { orderId: orderId }
    });
  }

  static async getOrders(queries: OrderQueries) {
    return await prisma.order.findMany({
      take: queries.limit,
      skip: queries.offset,

      where: {
        customerId: queries.userId,
        shopId: queries.shopId,
        transProviderId: queries.providerId,
        status: queries.status,
        createdAt: {
          gte: queries.createdAfter,
          lte: queries.createdBefore
        },
        orderProducts: queries.product ? {
          some: {
            productId: queries.product,
            price: {
              gte: queries.minValue,
              lte: queries.maxValue
            }
          }
        } : undefined,
        totalAmount: {
          gte: queries.minValue,
          lte: queries.maxValue
        }
      },

      orderBy: queries.orderBy ? {
        [queries.orderBy]: queries.order
      } : undefined,
    });
  }

  private static canUpdateOrderStatus(currentStatus: OrderStatus, newStatus: OrderStatus) {
    const ORDER_MAP = new Map<OrderStatus, OrderStatus[]>([
      [OrderStatus.WAITING_ACCEPTANCE, [OrderStatus.CANCELED, OrderStatus.ACCEPTED, OrderStatus.REJECTED]],
      [OrderStatus.CANCELED, []],
      [OrderStatus.REJECTED, []],
      [OrderStatus.ACCEPTED, [OrderStatus.DELIVERING]],
      [OrderStatus.DELIVERING, [OrderStatus.DELIVERED]],
      [OrderStatus.DELIVERED, [OrderStatus.RECEIVED]],
      [OrderStatus.RECEIVED, [OrderStatus.COMPLETED, OrderStatus.RETURNED]],
      [OrderStatus.RETURNED, []],
      [OrderStatus.COMPLETED, []]
    ]);

    return ORDER_MAP.get(currentStatus)?.includes(newStatus);
  }

  static async updateOrderStatus(orderId: number, newStatus: OrderStatus) {
    const order = await prisma.order.findUnique({
      where: { orderId: orderId },
      include: {
        orderProducts: {
          select: { 
            productId: true, 
            quantity: true
          }
        }
      }
    });
    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (!this.canUpdateOrderStatus(order.status, newStatus)) {
      throw new BadRequestError("Invalid status transition");
    }

    if (newStatus === OrderStatus.COMPLETED) {
      order.orderProducts.forEach(async ({ productId, quantity }) => {
        await prisma.product.update({
          where: { productId: productId },
          data: { 
            quantity: { decrement: quantity },
            numSoldProduct: { increment: quantity }
          }
        });
      });
    }

    return await prisma.order.update({
      where: { orderId: orderId },
      data: { status: newStatus }
    });
  }

}


export default OrderService;