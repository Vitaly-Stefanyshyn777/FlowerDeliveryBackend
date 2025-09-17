import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type NPRequest = {
  modelName: string;
  calledMethod: string;
  methodProperties?: Record<string, any>;
};

@Injectable()
export class NovaPoshtaService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.novaposhta.ua/v2.0/json/';

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>('NP_API_KEY');
    if (!this.apiKey) {
      throw new InternalServerErrorException('NP_API_KEY is not configured');
    }
  }

  private async call<T>(body: NPRequest): Promise<T> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: this.apiKey, ...body }),
    });
    if (!res.ok) {
      throw new InternalServerErrorException('Nova Poshta API error');
    }
    const data = await res.json();
    if (!data?.success) {
      const message =
        Array.isArray(data?.errors) && data.errors.length
          ? data.errors.join('; ')
          : 'Nova Poshta error';
      throw new InternalServerErrorException(message);
    }
    return data as T;
  }

  async searchCities(query: string, limit = 10) {
    const resp = await this.call<{ data: any[] }>({
      modelName: 'Address',
      calledMethod: 'searchSettlements',
      methodProperties: { CityName: query, Limit: limit, Page: 1 },
    });
    const items = (resp.data?.[0]?.Addresses || []).map((c: any) => ({
      ref: c.DeliveryCity || c.Ref,
      name: c.Present || c.MainDescription,
      region: c.Area || c.Region,
    }));
    return { items };
  }

  async getWarehousesByCity(params: {
    cityRef?: string;
    cityName?: string;
    type?: 'warehouse' | 'postomat' | 'both';
    page?: number;
    limit?: number;
    streetQuery?: string;
  }) {
    const {
      cityRef,
      cityName,
      type = 'both',
      page = 1,
      limit = 100,
      streetQuery,
    } = params;
    const props: any = { Page: page, Limit: Math.min(200, Math.max(1, limit)) };
    if (cityRef) props.CityRef = cityRef;
    else if (cityName) props.CityName = cityName;
    // Фільтр по типу
    if (type === 'postomat') props.IsPostomat = '1';
    if (type === 'warehouse') props.IsPostomat = '0';

    const resp = await this.call<{ data: any[] }>({
      modelName: 'AddressGeneral',
      calledMethod: 'getWarehouses',
      methodProperties: props,
    });
    const points = (resp.data || [])
      .filter(
        (w: any) =>
          !streetQuery ||
          w.Description?.toLowerCase().includes(streetQuery.toLowerCase()) ||
          w.ShortAddress?.toLowerCase().includes(streetQuery.toLowerCase()),
      )
      .map((w: any) => ({
        id: w.Ref,
        name: w.Description,
        address: w.ShortAddress || w.SiteKey,
        lat: Number(w.Latitude),
        lng: Number(w.Longitude),
        isPostomat: w.IsPostomat === '1',
        cityRef: w.CityRef,
      }));
    return { points, meta: { page, limit } };
  }
}
