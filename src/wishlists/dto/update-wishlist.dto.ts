import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { CreateWishlistDto } from './create-wishlist.dto';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  @IsNumber({}, { each: true })
  itemsId: number[];

  @IsString()
  @Length(1, 250)
  @IsOptional()
  name: string;

  @IsString()
  @Length(1, 1500)
  @IsOptional()
  description: string;

  @IsUrl()
  @IsOptional()
  image: string;
}
