import { IsNumber, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishlistDto {
  @IsNumber({}, { each: true })
  itemsId: number[];

  @IsString()
  @Length(1, 250)
  name: string;

  @IsString()
  @Length(1, 1500)
  description: string;

  @IsUrl()
  image: string;
}
