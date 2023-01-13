import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity';
import { Offer } from './entities/offer.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(
    @Req() { user }: { user: User },
    @Body() createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    return await this.offersService.create(user.id, createOfferDto);
  }

  @Get()
  async findAll(): Promise<Offer[]> {
    return await this.offersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Offer> {
    return await this.offersService.findOne(+id);
  }
}
