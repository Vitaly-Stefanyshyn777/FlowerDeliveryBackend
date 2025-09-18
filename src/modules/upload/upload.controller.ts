import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploads: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async upload(@UploadedFile() file: Express.Multer.File) {
    const res = await this.uploads.uploadBuffer(file.buffer);
    return { url: res.secure_url, publicId: res.public_id };
  }

  @Post('by-url')
  async uploadByUrl(@Body('url') url: string) {
    const res = await this.uploads.uploadByUrl(url);
    return { url: res.secure_url, publicId: res.public_id };
  }
}
