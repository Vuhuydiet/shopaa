import { BadRequestError, NotFoundError } from "../../core/ErrorResponse";
import prisma from "../../models";

type CartItemData = {
  productId: number,
  color?: string,
  size?: string,
}

type Query = {
  limit?: number,
  offset?: number,
}

class CartService {

  static async createCartItem(userId: number, cartItemData: CartItemData) {
    const product = await prisma.product.findUnique({
      where: { productId: cartItemData.productId }
    });

    if (!product)
      throw new NotFoundError('Product not found');

    if (cartItemData.color && !product.colors.includes(cartItemData.color))
      throw new BadRequestError(`Invalid color: ${cartItemData.color}, available colors: ${product.colors.join(', ')}`);

    if (cartItemData.size && !product.sizes.includes(cartItemData.size))
      throw new BadRequestError(`Invalid size: ${cartItemData.size}, available sizes: ${product.sizes.join(', ')}`);

    if (await prisma.cartItem.findFirst({
      where: {
        userId: userId,
        productId: cartItemData.productId,
        color: cartItemData.color,
        size: cartItemData.size
      }
    })) {
      throw new BadRequestError('Cart item already exists');
    }
    return await prisma.cartItem.create({
      data: {
        user: { connect: { userId: userId } },
        product: { connect: { productId: cartItemData.productId } },
        color: cartItemData.color,
        size: cartItemData.size
      }
    });
  }

  static async getCartItems(userId: number, query: Query) {
    const { limit, offset } = query;
    return await prisma.$transaction(async (tx) => {
      const cartItems = await tx.$queryRaw`
      SELECT
        i."cartItemId",
        p."shopId"
        p."productId",
        p."productName",
        p."currentPrice",
        img."imageUrl" as "imageUrl",
        i."color",
        i."size"
      FROM "CartItem" i
      LEFT JOIN "Product" p ON i."productId" = p."productId"
      LEFT JOIN "ProductImage" pi ON p."productId" = pi."productId"
      LEFT JOIN "Image" img ON img."imageId" = pi."imageId"
      WHERE i."userId" = ${userId}
      AND (img."order" = NULL OR img."order" = (
        SELECT MIN("order") FROM "ProductImage" WHERE "productId" = p."productId"
      ))
      ORDER BY p."shopId"
      LIMIT ${limit ?? 100}
      OFFSET ${offset ?? 0}
    ` as any[];

      const cartItemsGroups = cartItems.reduce((groups: any[], item: any) => {
        if (groups.length === 0 || groups[groups.length - 1].shopId !== item.shopId) {
          groups.push({
            shopId: item.shopId,
            products: []
          });
        }

        groups[groups.length - 1].products.push({
          productId: item.productId,
          productName: item.productName,
          currentPrice: item.currentPrice,
          imageUrl: item.imageUrl,
          color: item.color,
          size: item.size
        })
      }, []);

      const shops = await Promise.all(cartItemsGroups.map((group: any) => tx.shop.findUnique({
        where: { shopOwnerId: group.shopId }
      })));

      return cartItemsGroups.map((group: any, index: number) => ({
        shop: shops[index],
        products: group.products
      }));
    });
  }

  static async deleteCartItem(userId: number, cartItemData: CartItemData) {

    await prisma.cartItem.deleteMany({
      where: {
        userId: userId,
        productId: cartItemData.productId,
        color: cartItemData.color,
        size: cartItemData.size
      }
    })
  }

}

export default CartService;