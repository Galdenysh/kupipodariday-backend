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

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get('me')
  async findMe(@Req() { user }: { user: User }) {
    return await this.usersService.findOne(user.id);
  }

  @Patch('me')
  async updateMe(
    @Req() { user }: { user: User },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(user.id, updateUserDto);
  }

  @Post('find')
  async findUser(@Body() { query }: { query: string }) {
    return await this.usersService.findMany(query);
  }

  @Get(':username')
  async findByUsername(@Param('username') username: string) {
    return await this.usersService.findByUsernamePublic(username);
  }
}
