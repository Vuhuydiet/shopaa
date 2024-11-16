import { Image } from '@prisma/client';
import prisma from '../../models';
import CloudServices from '../../externalServices/cloud/cloud.service';

class ImageService {

  static async createImage(image: Express.Multer.File, tx: any = prisma) {
    const imageData = await CloudServices.uploadImage(image);
    return await tx.image.create({
      data: {
        publicId: imageData.publicId,
        url: imageData.url,
        createdAt: imageData.createdAt
      }
    }) as Image;
  }

  static async getImageById(imageId: number, tx: any = prisma) {
    return await tx.image.findUnique({
      where: {
        imageId
      }
    }) as Image;
  }

  static async deleteImage(imageId: number, tx: any = prisma) {
    const { publicId } = await this.getImageById(imageId, tx);
    await CloudServices.deleteImage(publicId);
    await tx.image.delete({
      where: {
        imageId
      }
    });
  }

}

export default ImageService;