import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userId?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  productId?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity?: number;
}
