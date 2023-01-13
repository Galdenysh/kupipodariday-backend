import { PartialType } from '@nestjs/swagger';
import { IsInt, IsNumber } from 'class-validator';
import { CreateWishDto } from './create-wish.dto';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @IsNumber()
  raised: number;

  @IsInt()
  copied: number;
}
