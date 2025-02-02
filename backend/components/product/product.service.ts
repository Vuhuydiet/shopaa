import { InternalServerError, NotFoundError } from '../../core/responses/ErrorResponse';
import prisma from '../../models';
import ImageService from '../image/image.service';
import ShopService from '../shop/shop.service';

type ProductCategoryData = {
  name: string;
  description?: string;
};

type ProductData = {
  name: string;
  quantity?: number;
  price: number;
  brand?: string;
  description?: string;
  material?: string;
  origin?: string;
  colors?: string[];
  sizes?: string[];
  images?: {
    add?: Express.Multer.File[];
    remove?: number[];
  };
  categories?: {
    add?: number[];
    remove?: number[];
  };
};

type ProductQuery = {
  keyword?: string;
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
};

const returnProductInclude: any = {
  categories: true,
  productImages: {
    select: {
      image: true,
    },
  },
};

function getCondition(queryParams: ProductQuery) {
  const condition = {
    sellerId: queryParams.shopId,
    categories: queryParams.category
      ? {
          some: {
            categoryId: queryParams.category,
          },
        }
      : undefined,
    brand: queryParams.brand,
    quantity: {
      gte: queryParams.minQuantity,
      lte: queryParams.maxQuantity,
    },
    currentPrice: {
      gte: queryParams.minPrice,
      lte: queryParams.maxPrice,
    },
    publishedAt: {
      gte: queryParams.postedAfter,
      lte: queryParams.postedBefore,
    },
    OR: queryParams.keyword
      ? [
          { productName: { contains: queryParams.keyword } },
          { productDescription: { contains: queryParams.keyword } },
        ]
      : undefined,
  } as any;

  return condition;
}

class ProductService {
  static async createCategory({ name, description }: ProductCategoryData) {
    return await prisma.productCategory.create({
      data: {
        categoryName: name,
        description: description,
      },
    });
  }

  static async checkProductVariantExists(
    productId: number,
    color?: string,
    size?: string,
  ) {
    const product = await prisma.product.findFirst({
      where: {
        productId: productId,
      },
    });

    if (!product) return false;

    if (color && !product.colors.includes(color)) return false;
    if (!color && product.colors.length > 0) return false;
    if (size && !product.sizes.includes(size)) return false;
    if (!size && product.sizes.length > 0) return false;

    return true;
  }

  static async getCategoryById(categoryId: number) {
    return await prisma.productCategory.findUnique({
      where: {
        categoryId: categoryId,
      },
    });
  }

  static async getAllCategories() {
    return await prisma.productCategory.findMany();
  }

  static async updateCategory(
    categoryId: number,
    { name, description }: ProductCategoryData,
  ) {
    return await prisma.productCategory.update({
      where: {
        categoryId: categoryId,
      },
      data: {
        categoryName: name,
        description: description,
      },
    });
  }

  static async deleteCategory(categoryId: number) {
    await prisma.productCategory.delete({
      where: {
        categoryId: categoryId,
      },
    });
  }

  static async createProductImages(
    productId: number,
    imageFiles: Express.Multer.File[],
    tx: any,
  ) {
    if (!(await tx.product.findUnique({ where: { productId } }))) {
      throw new InternalServerError('Product not found');
    }

    const images = await Promise.all(
      imageFiles.map((image) => ImageService.createImage(image, tx)),
    );

    await Promise.all(
      images.map(({ imageId }) =>
        tx.productImage.create({
          data: {
            imageId: imageId,
            productId: productId,
          },
        }),
      ),
    );
  }

  static async createProduct(shopId: number, productData: ProductData) {
    await ShopService.checkShopExists(shopId);

    return await prisma.$transaction(async (tx) => {
      const { productId } = await tx.product.create({
        data: {
          productName: productData.name,
          quantity: productData.quantity,
          currentPrice: productData.price,
          originalPrice: productData.price,
          brand: productData.brand,
          productDescription: productData.description,
          material: productData.material,
          origin: productData.origin,
          colors: productData.colors,
          sizes: productData.sizes,
          shop: {
            connect: { shopOwnerId: shopId },
          },
          categories: {
            connect: productData.categories?.add?.map((category) => ({
              categoryId: category,
            })),
          },
        },
        select: { productId: true },
      });

      await this.createProductImages(
        productId,
        productData.images?.add || [],
        tx,
      );

      return await tx.product.findUnique({
        where: { productId },
        include: returnProductInclude,
      });
    });
  }

  static async getProductById(productId: number) {
    const product = await prisma.product.findUnique({
      where: {
        productId: productId,
      },
      include: returnProductInclude,
    });

    if (!product) throw new NotFoundError('Product not found');

    return product;
  }

  static async getAllProducts(queryParams: ProductQuery) {
    const [count, products] = await Promise.all([
      prisma.product.count({
        where: getCondition(queryParams),
      }),

      prisma.product.findMany({
        skip: queryParams.offset,
        take: queryParams.limit,

        where: getCondition(queryParams),
        orderBy: queryParams.sortBy
          ? {
              [queryParams.sortBy as string]: queryParams.order,
            }
          : undefined,

        include: returnProductInclude,
      }),
    ]);

    return { count, products };
  }

  // temporary implementation
  static async searchProducts(queryParams: ProductQuery) {
    const [count, products] = await Promise.all([
      prisma.product.count({
        where: getCondition(queryParams),
      }),

      prisma.product.findMany({
        skip: queryParams.offset,
        take: queryParams.limit,

        where: getCondition(queryParams),

        orderBy: queryParams.sortBy
          ? {
              [queryParams.sortBy as string]: queryParams.order,
            }
          : undefined,

        include: returnProductInclude,
      }),
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
        quantity: { increment: inc },
      },
    });
    return quantity;
  }

  static async updateProduct(productId: number, productData: ProductData) {
    await this.getProductById(productId);

    return await prisma.$transaction(async (tx) => {
      const deletingImages = await tx.productImage.findMany({
        where: {
          productId: productId,
          imageId: { in: productData.images?.remove || [] },
        },
      });
      await Promise.all(
        deletingImages.map(({ imageId }) =>
          ImageService.deleteImage(imageId, tx),
        ),
      );

      await tx.product.update({
        where: {
          productId: productId,
        },
        data: {
          productName: productData.name,
          productDescription: productData.description,
          quantity: productData.quantity,
          currentPrice: productData.price,
          brand: productData.brand,
          material: productData.material,
          origin: productData.origin,
          colors: productData.colors,
          sizes: productData.sizes,
          categories: {
            connect: productData.categories?.add?.map((category) => ({
              categoryId: category,
            })),
            disconnect: productData.categories?.remove?.map((category) => ({
              categoryId: category,
            })),
          },
        },
      });

      await this.createProductImages(
        productId,
        productData.images?.add || [],
        tx,
      );

      return await tx.product.findUnique({
        where: { productId },
        include: returnProductInclude,
      });
    });
  }
  static async deleteProduct(productId: number) {
    await this.getProductById(productId);

    await prisma.$transaction(async (tx) => {
      const images = await tx.productImage.findMany({
        where: { productId: productId },
      });

      await Promise.all(
        images.map((image) => ImageService.deleteImage(image.imageId, tx)),
      );

      await tx.product.delete({
        where: {
          productId: productId,
        },
      });
    });
  }
}

export default ProductService;
