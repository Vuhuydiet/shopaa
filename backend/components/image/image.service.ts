import { uploadImage, deleteImage } from '../../libraries/cloudinary';
import prisma from '../../models';

class ImageService {

  static async createImage(image: Express.Multer.File, tx: any = prisma) {
    const result = await uploadImage(image) as any;
    return await tx.image.create({
      data: {
        publicId: result.public_id,
        url: result.secure_url
      }
    });
  }

  static async getImageByPublicId(publicId: string, tx: any = prisma) {
    return await tx.image.findUnique({
      where: {
        publicId
      }
    });
  }

  static async deleteImage(publicId: string, tx: any = prisma) {
    await deleteImage(publicId);
    
    await tx.image.delete({
      where: {
        publicId
      }
    });
  }

}

export default ImageService;