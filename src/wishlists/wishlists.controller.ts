import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Wishlist } from './entities/wishlist.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  async create(
    @Req() { user }: { user: User },
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    return await this.wishlistsService.create(user.id, createWishlistDto);
  }

  @Get()
  async findAll(): Promise<Wishlist[]> {
    return await this.wishlistsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Wishlist> {
    return await this.wishlistsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Req() { user }: { user: User },
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return await this.wishlistsService.update(+id, user.id, updateWishlistDto);
  }

  @Delete(':id')
  async remove(
    @Req() { user }: { user: User },
    @Param('id') id: number,
  ): Promise<Wishlist> {
    return await this.wishlistsService.remove(+id, user.id);
  }
}
