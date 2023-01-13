import { IsBoolean, IsInt } from 'class-validator';

export class CreateOfferDto {
  @IsInt()
  itemId: number;

  @IsInt()
  amount: number;

  @IsBoolean()
  hidden: boolean;
}
