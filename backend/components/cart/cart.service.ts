import { BadRequestError, NotFoundError } from "../../core/ErrorResponse";
import prisma from "../../models";
import ProductService from "../product/product.service";

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

    if (!(await ProductService.checkProductVariantExists(cartItemData.productId, cartItemData.color, cartItemData.size))) {
      throw new BadRequestError('Product variant not found');
    }

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
      const count = await tx.cartItem.count({
        where: { userId: userId }
      });

      const cartItems = await tx.$queryRaw`
        SELECT
          i."cartItemId",
          p."sellerId",
          p."productId",
          p."productName",
          p."currentPrice",
          p."originalPrice",
          img."url" as "imageUrl",
          i."color",
          i."size",
          p."colors" as "availableColors",
          p."sizes" as "availableSizes"
        FROM "CartItem" i
        LEFT JOIN "Product" p ON i."productId" = p."productId"
        LEFT JOIN "ProductImage" pi ON p."productId" = pi."productId"
        LEFT JOIN "Image" img ON img."imageId" = pi."imageId"
        WHERE i."userId" = ${userId}
        AND (pi."order" IS NULL OR pi."order" = (
          SELECT MIN("order") FROM "ProductImage" WHERE "productId" = p."productId"
        ))
        ORDER BY p."sellerId"
        LIMIT ${limit ?? 100}
        OFFSET ${offset ?? 0}
      ` as any[];

      const cartItemsGroups = cartItems.reduce((groups: any[], item: any) => {
        if (groups.length === 0 || groups[groups.length - 1].sellerId !== item.sellerId) {
          groups.push({
            sellerId: item.sellerId,
            products: []
          });
        }

        groups[groups.length - 1].products.push({
          cartItemId: item.cartItemId,
          productId: item.productId,
          productName: item.productName,
          currentPrice: item.currentPrice,
          originalPrice: item.originalPrice,
          imageUrl: item.imageUrl,
          color: item.color,
          size: item.size,
          availableColors: item.availableColors,
          availableSizes: item.availableSizes
        });
        
        return groups; 
      }, []);

      const shops = await Promise.all(cartItemsGroups.map((group: any) => tx.shop.findUnique({
        where: { shopOwnerId: group.sellerId }
      })));

      const result = cartItemsGroups.map((group: any, index: number) => ({
        shop: shops[index],
        products: group.products
      }));
      return {
        count,
        cartItems: result
      }
    });
  }

  static async deleteCartItem(userId: number, cartItemId: number) {
    const cartItem = await prisma.cartItem.findUnique({
      where: { cartItemId: cartItemId }
    });

    if (!cartItem)
      throw new NotFoundError('Cart item not found');
    
    if (cartItem.userId !== userId)
      throw new BadRequestError('Cart item does not belong to user');
    
    await prisma.cartItem.delete({
      where: {
        cartItemId: cartItemId,
      }
    });
  }

}

export default CartService;