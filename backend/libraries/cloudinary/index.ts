import cloudinary from 'cloudinary';

import keyConfig from '../../configs/key.config';

cloudinary.v2.config({
  cloudinary_url: keyConfig.CLOUDINARY_URL
});

const uploadImage = async (file: Express.Multer.File) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    }).end(file.buffer);
  });
};

const deleteImage = async (publicId: string) => {
  const result = await cloudinary.v2.uploader.destroy(publicId);
  if (result.result !== 'ok') {
    throw new Error('Failed to delete image');
  }
}

export { uploadImage, deleteImage };
