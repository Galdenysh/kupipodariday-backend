import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class GetUserDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;

  @IsString()
  @Length(2, 30)
  @IsNotEmpty()
  username: string;

  @IsString()
  @Length(2, 200)
  about: string;

  @IsUrl()
  avatar: string;
}
