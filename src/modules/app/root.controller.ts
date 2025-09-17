import { Controller, Get } from '@nestjs/common';

@Controller()
export class RootController {
  @Get()
  getRoot(): { message: string; api: string; docs: string } {
    return {
      message: 'Flower Delivery Backend API',
      api: '/api/v1',
      docs: '/api',
    };
  }
}
