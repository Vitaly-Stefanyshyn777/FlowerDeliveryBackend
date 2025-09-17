import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NovaPoshtaService } from './nova-poshta.service';

@ApiTags('nova-poshta')
@Controller('nova-poshta')
export class NovaPoshtaController {
  constructor(private readonly np: NovaPoshtaService) {}

  @Get('cities')
  getCities(@Query('query') query: string, @Query('limit') limit?: string) {
    if (!query || !query.trim()) {
      return { items: [] };
    }
    const lim = Math.min(50, Math.max(1, Number(limit) || 10));
    return this.np.searchCities(query.trim(), lim);
  }

  @Get('warehouses')
  getWarehouses(
    @Query('cityRef') cityRef?: string,
    @Query('cityName') cityName?: string,
    @Query('type') type?: 'warehouse' | 'postomat' | 'both',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('streetQuery') streetQuery?: string,
  ) {
    const p = Math.max(1, Number(page) || 1);
    const lim = Math.min(200, Math.max(1, Number(limit) || 100));
    return this.np.getWarehousesByCity({
      cityRef,
      cityName,
      type,
      page: p,
      limit: lim,
      streetQuery,
    });
  }
}
