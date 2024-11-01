import { NotFoundError } from "../core/ErrorResponse";
import prisma from "../prisma"

type ProductCategoryData = {
  name: string;
  description?: string;
}

type PrimaryProductData = {
  shopId: number;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  brand?: string;
}

type NewProductData = PrimaryProductData & {
  categories: number[];
  images: string[];
}

type UpdateProductData = PrimaryProductData & {
  images: {
    add: string[],
    remove: number[]
  },
  categories: {
    add: number[],
    remove: number[]
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
  sortBy?: 'currentPrice' | 'quantity';
  order?: 'asc' | 'desc';

  offset?: number;
  limit: number;
}

const defaultProductQueryParams: ProductQueryParams = {
  category: undefined,
  minPrice: 0,
  maxPrice: Infinity,
  minQuantity: 0,
  maxQuantity: Infinity,
  sortBy: undefined,
  order: undefined,
  offset: 0,
  limit: 25,
};

class ProductService {

  static async createProductCategory({ name, description }: ProductCategoryData) {
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

  static async updateProductCategory(categoryId: number, { name, description }: ProductCategoryData) {
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

  static async deleteProductCategory(categoryId: number) {
    await prisma.productCategory.delete({
      where: {
        categoryId: categoryId
      }
    });
  }

  static async createProduct({ shopId, name, description, quantity, price, brand, categories, images }: NewProductData) {
    return await prisma.product.create({
      data: {
        productName: name,
        productDescription: description,
        quantity: quantity,
        currentPrice: price,
        originalPrice: price,
        brand: brand,

        shop: {
          connect: {
            shopOwnerId: shopId
          }
        },

        categories: {
          connect: categories.map(category => ({ categoryId: category }))
        },

        productImages: {
          createMany: {
            data: images.map(image => ({ URL: image }))
          }
        }
      },
    });
  }

  static async checkProductExists(productId: number) {
    const product = await prisma.product.findUnique({
      where: {
        productId: productId,
        isDeleted: false
      }
    });
    if (!product || product.isDeleted)
      throw new NotFoundError('Product not found');
  }

  static async getProductById(productId: number) {
    const product = await prisma.product.findUnique({
      where: {
        productId: productId,
        isDeleted: false
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
      where: {
        isDeleted: false,
        sellerId: queryParams.shopId,
        categories: {
          some: {
            categoryId: queryParams.category
          }
        },
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
      skip: queryParams.offset,
      take: queryParams.limit
    });
  }

  // temporary implementation
  static async searchProducts(keyword: string, queryParams: ProductQueryParams = defaultProductQueryParams) {
    const queryProducts = await this.getAllProducts(queryParams);
    return queryProducts.filter(product => (product.productName.includes(keyword)) || product.brand?.includes(keyword) || product.productDescription?.includes(keyword));
  }

  static async incrementProductQuantity(productId: number, quantity: number) {
    this.checkProductExists(productId);

    await prisma.product.update({
      where: { 
        productId: productId,
        isDeleted: false
      },
      data: {
        quantity: {
          increment: quantity
        }
      }
    });
  }

  static async updateProduct(productId: number, { name, description, quantity, price, brand, categories, images }: UpdateProductData) {
    this.checkProductExists(productId);

    return await prisma.product.update({
      where: { 
        productId: productId,
        isDeleted: false
      },
      data: {
        productName: name,
        productDescription: description,
        quantity: quantity,
        currentPrice: price,
        brand: brand,

        categories: {
          connect: categories.add.map(category => ({ categoryId: category })),
          disconnect: categories.remove.map(category => ({ categoryId: category }))
        },

        productImages: {
          createMany: {
            data: images.add.map(image => ({ URL: image })),
          },
          deleteMany: {
            productId: productId,
            ordinalNumber: {
              in: images.remove
            }
          }
        }
      }
    });
  }
  static async deleteProduct(productId: number) {
    this.checkProductExists(productId);

    await prisma.product.update({
      where: { productId: productId },
      data: {
        isDeleted: true
      }
    });
  }
}



export default ProductService;