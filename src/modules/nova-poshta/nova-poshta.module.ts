import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NovaPoshtaService } from './nova-poshta.service';
import { NovaPoshtaController } from './nova-poshta.controller';

@Module({
  imports: [ConfigModule],
  providers: [NovaPoshtaService],
  controllers: [NovaPoshtaController],
  exports: [NovaPoshtaService],
})
export class NovaPoshtaModule {}
