import { NotFoundError } from '../../core/ErrorResponse'
import prisma from "../../models"
import ImageService from '../image/image.service';
import ShopService from '../shop/shop.service';

type ProductCategoryData = {
  name: string;
  description?: string;
}

type ProductData = {
  name: string;
  description?: string;
  quantity?: number;
  price: number;
  brand?: string;
  images?: {
    add?: Express.Multer.File[],
    remove?: string[]
  },
  categories?: {
    add?: number[],
    remove?: number[]
  }
}

type ProductQueryParams = {
  shopId?: number;
  category?: number;
  brand?: string;
  postedAfter?: Date;
  postedBefore?: Date;
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
  sortBy?: 'currentPrice' | 'quantity' | 'publishedAt';
  order?: 'asc' | 'desc';

  offset?: number;
  limit?: number;
}

const returnProductInclude: any = {
  categories: true,
  productImages: {
    select: {
      image: true
    }
  }
}

function getCondition(queryParams: ProductQueryParams) {
  const condition = {
    sellerId: queryParams.shopId,
    categories: queryParams.category ? {
      some: {
        categoryId: queryParams.category
      }
    } : undefined,
    brand: queryParams.brand,
    quantity: {
      gte: queryParams.minQuantity,
      lte: queryParams.maxQuantity
    },
    currentPrice: {
      gte: queryParams.minPrice,
      lte: queryParams.maxPrice
    },
    publishedAt: {
      gte: queryParams.postedAfter,
      lte: queryParams.postedBefore,
    },
  } as any;

  return condition;
}

class ProductService {

  static async createCategory({ name, description }: ProductCategoryData) {
    return await prisma.productCategory.create({
      data: {
        categoryName: name,
        description: description
      }
    });
  }

  static async getCategoryById(categoryId: number) {
    return await prisma.productCategory.findUnique({
      where: {
        categoryId: categoryId
      }
    });
  }

  static async getAllCategories() {
    return await prisma.productCategory.findMany();
  }

  static async updateCategory(categoryId: number, { name, description }: ProductCategoryData) {
    return await prisma.productCategory.update({
      where: {
        categoryId: categoryId
      },
      data: {
        categoryName: name,
        description: description
      }
    });
  }

  static async deleteCategory(categoryId: number) {
    await prisma.productCategory.delete({
      where: {
        categoryId: categoryId
      }
    });
  }

  static async createProduct(shopId: number, productData: ProductData) {
    await ShopService.checkShopExists(shopId);

    return await prisma.$transaction(async (tx) => {
      const { productId } = await tx.product.create({
        data: {
          productName: productData.name,
          productDescription: productData.description,
          quantity: productData.quantity,
          currentPrice: productData.price,
          originalPrice: productData.price,
          brand: productData.brand,
          shop: {
            connect: { shopOwnerId: shopId }
          },
          categories: {
            connect: productData.categories?.add?.map(category => ({ categoryId: category }))
          },
        },
        select: { productId: true }
      });
      console.log(productData.images?.add);
      const images = productData.images?.add ?
        await Promise.all(productData.images?.add?.map(image => ImageService.createImage(image, tx))) : [];

      await Promise.all(images.map(({ publicId }) => tx.productImage.create({
        data: {
          image: { connect: { publicId: publicId } },
          product: { connect: { productId: productId } }
        }
      })));

      return await tx.product.findUnique({
        where: { productId },
        include: returnProductInclude
      });
    })
  }

  static async getProductById(productId: number) {
    const product = await prisma.product.findUnique({
      where: {
        productId: productId,
      },
      include: returnProductInclude
    });

    if (!product)
      throw new NotFoundError('Product not found');

    return product;
  }

  static async getAllProducts(queryParams: ProductQueryParams) {
    const [count, products] = await Promise.all([
      prisma.product.count({
        where: getCondition(queryParams)
      }),

      prisma.product.findMany({
        skip: queryParams.offset,
        take: queryParams.limit,

        where: getCondition(queryParams),
        orderBy: queryParams.sortBy ? {
          [queryParams.sortBy as string]: queryParams.order
        } : undefined,

        include: returnProductInclude
      })
    ]);
    
    return { count, products };
  }

  // temporary implementation
  static async searchProducts(keyword: string, queryParams: ProductQueryParams) {
    const [count, products] = await Promise.all([
      prisma.product.count({
        where: {
          ...getCondition(queryParams),
          productName: { contains: keyword },
          productDescription: { contains: keyword }
        }
      }),

      prisma.product.findMany({
        skip: queryParams.offset,
        take: queryParams.limit,

        where: {
          ...getCondition(queryParams),
          productName: { contains: keyword },
          productDescription: { contains: keyword }
        },

        orderBy: queryParams.sortBy ? {
          [queryParams.sortBy as string]: queryParams.order
        } : undefined,

        include: returnProductInclude
      })
    ]);

    return { count, products };
  }

  static async incrementProductQuantity(productId: number, inc: number) {
    await this.getProductById(productId);

    const { quantity } = await prisma.product.update({
      where: {
        productId: productId,
      },
      data: {
        quantity: { increment: inc }
      }
    });
    return quantity;
  }

  static async updateProduct(productId: number, { name, description, quantity, price, brand, categories, images }: ProductData) {
    await this.getProductById(productId);

    return await prisma.$transaction(async (tx) => {
      const deletingImages = await tx.productImage.findMany({
        where: {
          productId: productId,
          imageId: { in: images?.remove }
        }
      });

      await Promise.all(deletingImages.map(({ imageId }) => ImageService.deleteImage(imageId, tx)));

      const newImages = await Promise.all((images?.add || []).map(image => ImageService.createImage(image, tx)));

      await tx.product.update({
        where: {
          productId: productId,
        },
        data: {
          productName: name,
          productDescription: description,
          quantity: quantity,
          currentPrice: price,
          brand: brand,

          categories: {
            connect: categories?.add?.map(category => ({ categoryId: category })),
            disconnect: categories?.remove?.map(category => ({ categoryId: category }))
          },

          productImages: {
            create: newImages.map(publicId => ({
              image: { connect: publicId }
            }))
          }
        }
      });

      await Promise.all(newImages.map(({ publicId }) => tx.productImage.create({
        data: {
          image: { connect: { publicId: publicId } },
          product: { connect: { productId: productId } }
        }
      })));

      return await tx.product.findUnique({
        where: { productId },
        include: returnProductInclude
      });
    });
  }
  static async deleteProduct(productId: number) {
    await this.getProductById(productId);

    await prisma.$transaction(async (tx) => {
      const images = await tx.productImage.findMany({
        where: { productId: productId }
      });

      await Promise.all(images.map(image => ImageService.deleteImage(image.imageId, tx)));

      await tx.product.delete({
        where: {
          productId: productId
        }
      });
    });
  }
}

export { ProductQueryParams };
export default ProductService;