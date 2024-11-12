import { NotFoundError } from '../../core/ErrorResponse'
import prisma from "../../models"
import ImageService from '../image/image.service';
import ShopService from '../shop/shop.service';

type ProductCategoryData = {
  name: string;
  description?: string;
}

type PrimaryProductData = {
  name: string;
  description?: string;
  quantity?: number;
  price: number;
  brand?: string;
}

type NewProductData = PrimaryProductData & {
  categories?: number[];
  images?: Express.Multer.File[];
}

type UpdateProductData = PrimaryProductData & {
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

const defaultProductQueryParams: ProductQueryParams = {
  offset: 0,
  limit: 100,
};

class ProductService {

  static async createCategory({ name, description }: ProductCategoryData) {
    await prisma.productCategory.create({
      data: {
        categoryName: name,
        description: description
      }
    });
  }

  static async getAllCategories() {
    return await prisma.productCategory.findMany();
  }

  static async updateCategory(categoryId: number, { name, description }: ProductCategoryData) {
    await prisma.productCategory.update({
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

  static async createProduct(shopId: number, productData: NewProductData) {
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
            connect: productData.categories?.map(category => ({ categoryId: category }))
          },
        },
        select: { productId: true }
      });
      const images = productData.images ? await Promise.all(productData.images.map(image => ImageService.createImage(image, tx))) : [];
      images.forEach(async ({ publicId }) => {
        await tx.productImage.create({
          data: {
            image: { connect: { publicId: publicId } },
            product: { connect: { productId: productId } }
          }
        });
      });
      return await tx.product.findUnique({
        where: { productId }
      });
    })
  }

  static async checkProductExists(productId: number) {
    const product = await prisma.product.findUnique({
      where: {
        productId: productId,
      }
    });
    if (!product)
      throw new NotFoundError('Product not found');
  }

  static async getProductById(productId: number) {
    const product = await prisma.product.findUnique({
      where: {
        productId: productId,
      },
      include: {
        categories: true,
        productImages: true
      }
    });
    if (!product)
      throw new NotFoundError('Product not found');

    return product;
  }

  static async getAllProducts(queryParams: ProductQueryParams = defaultProductQueryParams) {
    return await prisma.product.findMany({
      skip: queryParams.offset,
      take: queryParams.limit,

      where: {
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
      },
      orderBy: queryParams.sortBy ? {
        [queryParams.sortBy as string]: queryParams.order
      } : undefined,

      include: {
        categories: true,
        productImages: true
      }
    });
  }

  // temporary implementation
  static async searchProducts(keyword: string, queryParams: ProductQueryParams = defaultProductQueryParams) {
    const queryProducts = await this.getAllProducts(queryParams);

    return queryProducts.filter(
      product =>
        (product.productName.includes(keyword)) ||
        product.brand?.includes(keyword) ||
        product.productDescription?.includes(keyword)
    );
  }

  static async incrementProductQuantity(productId: number, quantity: number) {
    await this.checkProductExists(productId);

    await prisma.product.update({
      where: {
        productId: productId,
      },
      data: {
        quantity: {
          increment: quantity
        }
      }
    });
  }

  static async updateProduct(productId: number, { name, description, quantity, price, brand, categories, images }: UpdateProductData) {
    await this.checkProductExists(productId);

    return await prisma.$transaction(async (tx) => {
      const deletingImages = (await tx.productImage.findMany({
        where: {
          productId: productId,
          imageId: { in: images?.remove }
        }
      })).map(image => image.imageId);

      if (images && images.remove)
        await Promise.all(images.remove.filter(image => deletingImages.includes(image)).map(image => { ImageService.deleteImage(image, tx) }));

      const newImages = images && images.add ? await Promise.all(images.add.map(image => ImageService.createImage(image, tx))) : [];

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
              image: {
                connect: publicId
              }
            }))
          }
        }
      });
      newImages.forEach(async ({ publicId }) => {
        await tx.productImage.create({
          data: {
            image: { connect: { publicId: publicId } },
            product: { connect: { productId: productId } }
          }
        });
      });
      return await tx.product.findUnique({
        where: { productId }
      });
    });
  }
  static async deleteProduct(productId: number) {
    await this.checkProductExists(productId);

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