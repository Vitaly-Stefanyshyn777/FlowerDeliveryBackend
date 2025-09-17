import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CouponService } from './coupon.service';

@ApiTags('coupons')
@Controller('coupons')
export class CouponController {
  constructor(private readonly coupons: CouponService) {}

  @Get('active')
  listActive() {
    return this.coupons.listActive();
  }

  @Get('validate')
  validate(@Query('code') code: string, @Query('total') total?: string) {
    const t = total ? Number(total) : undefined;
    return this.coupons.validate(code, t);
  }
}
