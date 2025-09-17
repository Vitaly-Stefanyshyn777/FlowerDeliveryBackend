import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsNumber()
  @IsOptional()
  priceOriginal?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isHit?: boolean;

  @IsBoolean()
  @IsOptional()
  isNew?: boolean;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  priceOriginal?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isHit?: boolean;

  @IsBoolean()
  @IsOptional()
  isNew?: boolean;
}

export class ProductQueryDto {
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit: number = 20;

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @IsOptional()
  categories?: string[];

  @IsString()
  @IsOptional()
  search?: string;

  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  isHit?: boolean;

  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  isNew?: boolean;

  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  hasDiscount?: boolean;

  @IsString()
  @IsOptional()
  sortBy?: 'price' | 'createdAt' | 'name' | 'discountPercent';

  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc';
}
