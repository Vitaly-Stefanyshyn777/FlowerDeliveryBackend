import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiOptions,
} from 'cloudinary';

@Injectable()
export class UploadService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadBuffer(
    fileBuffer: Buffer,
    options?: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'flowers', ...options },
        (err, result) => {
          if (err) return reject(err);
          resolve(result as UploadApiResponse);
        },
      );
      upload.end(fileBuffer);
    });
  }

  async uploadByUrl(
    fileUrl: string,
    options?: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    return cloudinary.uploader.upload(fileUrl, {
      folder: 'flowers',
      ...options,
    });
  }
}
