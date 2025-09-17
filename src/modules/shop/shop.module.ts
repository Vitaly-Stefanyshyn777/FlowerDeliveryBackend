import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
