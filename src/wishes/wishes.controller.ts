import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Req() { user }: { user: User },
    @Body() createWishDto: CreateWishDto,
  ) {
    return this.wishesService.create(user.id, createWishDto);
  }

  @Get('last')
  async findLast() {
    return await this.wishesService.findLast();
  }

  @Get('top')
  async findTop() {
    return await this.wishesService.findTop();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.wishesService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Req() { user }: { user: User },
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return await this.wishesService.update(+id, user.id, updateWishDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Req() { user }: { user: User }, @Param('id') id: number) {
    return await this.wishesService.remove(+id, user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/copy')
  async copy(@Req() { user }: { user: User }, @Param('id') id: number) {
    return await this.wishesService.copy(+id, user.id);
  }
}
