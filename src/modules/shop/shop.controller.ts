import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ShopService } from './shop.service';

@ApiTags('shops')
@Controller('shops')
export class ShopController {
  constructor(private readonly shops: ShopService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shops.findOne(id);
  }
}
