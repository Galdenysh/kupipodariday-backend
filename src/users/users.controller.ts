import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { GetUserDto } from './dto/get-user.dto';
import { GetUserPublicDto } from './dto/get-user-public.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get('me')
  async findMe(@Req() { user }: { user: User }): Promise<GetUserDto> {
    return await this.usersService.findOne(user.id);
  }

  @Patch('me')
  async updateMe(
    @Req() { user }: { user: User },
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<GetUserDto> {
    return await this.usersService.update(user.id, updateUserDto);
  }

  @Get('me/wishes')
  async getWishesMe(@Req() { user }: { user: User }): Promise<Wish[]> {
    return await this.usersService.findWishes(user.id);
  }

  @Get(':username')
  async findByUsername(
    @Param('username') username: string,
  ): Promise<GetUserPublicDto> {
    return await this.usersService.findByUsernamePublic(username);
  }

  @Get(':username/wishes')
  async getWishes(@Param('username') username: string): Promise<Wish[]> {
    const user = await this.usersService.findByUsernamePublic(username);

    return await this.usersService.findWishes(user.id);
  }

  @Post('find')
  async findUser(@Body() { query }: { query: string }): Promise<GetUserDto[]> {
    return await this.usersService.findMany(query);
  }
}
