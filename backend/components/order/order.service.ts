import { OrderStatus } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../../core/ErrorResponse";
import prisma from "../../models";

type OrderData = {
  shippingAddress: string;
  transProvider: number;

  products: {
    productId: number;
    quantity: number;
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

  private static async calculateOrderValue(orderData: OrderData) {
    const provider = await prisma.transportationProvider.findUnique({
      where: { providerId: orderData.transProvider },
      select: { shippingFee: true }
    });
    if (!provider) {
      throw new NotFoundError("Invalid transportation provider");
    }

    const products = await Promise.all(
      orderData.products.map(async ({ productId }) => prisma.product.findUnique({
        where: { productId: productId },
      }))
    );
    if (products.some(product => product == null)) {
      throw new NotFoundError("Invalid product");
    }

    const totalProductCost = products.reduce((acc, product, idx) => {
      return acc + (product as any).currentPrice * orderData.products[idx].quantity;
    }, 0);

    return {
      products: products.filter(product => product != null),
      totalProductCost,
      shippingFee: provider.shippingFee
    };
  }

  static async createOrder(userid: number, productData: OrderData) {
    if (productData.products.length === 0) {
      throw new BadRequestError("Order must contain at least one product");
    }

    const { products, totalProductCost, shippingFee } = await this.calculateOrderValue(productData);

    const shopId = products[0].sellerId;
    if (products.some(product => product.sellerId !== shopId)) {
      throw new BadRequestError("All products must be from the same shop");
    }

    return await prisma.order.create({
      data: {
        shippingAddress: productData.shippingAddress,
        shippingFee: shippingFee,
        totalAmount: totalProductCost + shippingFee,

        customer: { connect: { userId: userid } },
        shop: { connect: { shopOwnerId: shopId } },
        transportationProvider: { connect: { providerId: productData.transProvider } },
        orderProducts: {
          create: products.map(product => ({
            productId: product.productId,
            quantity: product.quantity,
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
    const order = await prisma.order.findUnique({ where: { orderId: orderId } });
    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (!this.canUpdateOrderStatus(order.status, newStatus)) {
      throw new BadRequestError("Invalid status transition");
    }

    return await prisma.order.update({
      where: { orderId: orderId },
      data: { status: newStatus }
    });
  }

}


export default OrderService;