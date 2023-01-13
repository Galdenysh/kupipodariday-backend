import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UNIQUE_ERROR, USER_NOT_FOUND } from 'src/config/errors';
import { hashPass } from 'src/utils/hashPass';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await hashPass(createUserDto.password);
    const user = this.userRepository.create(createUserDto);

    try {
      await this.userRepository.save(user);
    } catch (err) {
      if (err.code && err.code === '23505')
        throw new ConflictException(UNIQUE_ERROR);

      throw new ConflictException();
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException(USER_NOT_FOUND);

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.findOneBy({ username });
  }

  async findByUsernamePublic(username: string): Promise<GetUserDto> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) throw new NotFoundException(USER_NOT_FOUND);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, email, ...rest } = user;

    return rest;
  }

  async findMany(query: string): Promise<GetUserDto[]> {
    const users = await this.userRepository.find({
      where: [{ username: query }, { email: query }],
    });

    if (users.length !== 0) {
      const usersWithoutPass = users.map((item) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, email, ...rest } = item;

        return rest;
      });

      return usersWithoutPass;
    }

    return users;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException(USER_NOT_FOUND);

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const foundedUser = await this.findMany(updateUserDto.username);

      if (foundedUser.length !== 0) throw new ConflictException(UNIQUE_ERROR);
    }

    if (updateUserDto.username && updateUserDto.email !== user.email) {
      const foundedUser = await this.findMany(updateUserDto.email);

      if (foundedUser.length !== 0) throw new ConflictException(UNIQUE_ERROR);
    }

    if (updateUserDto && updateUserDto.password)
      updateUserDto.password = await hashPass(updateUserDto.password);

    return this.userRepository.update({ id }, updateUserDto);
  }

  async findWishes(id: number): Promise<Wish[]> {
    const { wishes } = await this.userRepository.findOne({
      where: { id },
      select: {
        wishes: true,
      },
      relations: {
        wishes: {
          owner: true,
          offers: true,
        },
      },
    });

    return wishes;
  }
}
