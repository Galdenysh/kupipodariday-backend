import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private usersService: UsersService,
  ) {}

  async create(id: number, createWishDto: CreateWishDto): Promise<Wish> {
    const user = await this.usersService.findOne(id);
    const wish = this.wishRepository.create({
      owner: user,
      ...createWishDto,
    });

    delete wish.owner.email;
    delete wish.owner.password;

    return await this.wishRepository.save(wish);
  }

  async findLast(): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      take: 40,
      order: { createdAt: 'desc' },
      relations: {
        owner: true,
        offers: true,
      },
    });

    wishes.forEach((item) => {
      delete item.owner.email;
      delete item.owner.password;
    });

    return wishes;
  }

  async findTop(): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      take: 20,
      order: { copied: 'desc' },
      relations: {
        owner: true,
        offers: true,
      },
    });

    wishes.forEach((item) => {
      delete item.owner.email;
      delete item.owner.password;
    });

    return wishes;
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: true,
      },
    });

    if (!wish) throw new NotFoundException();

    delete wish.owner.email;
    delete wish.owner.password;

    return wish;
  }

  async update(
    id: number,
    ownerId: number,
    updateWishDto: UpdateWishDto,
  ): Promise<UpdateResult> {
    const wish = await this.wishRepository.findOneBy({ id });

    if (!wish) throw new NotFoundException();

    if (wish.raised !== 0) throw new ConflictException();

    if (wish.owner.id !== ownerId) throw new ConflictException();

    return this.wishRepository.update({ id }, updateWishDto);
  }

  async updateRaised(id: number, raised: number): Promise<UpdateResult> {
    const wish = await this.wishRepository.findOneBy({ id });

    if (!wish) throw new NotFoundException();

    return this.wishRepository.update({ id }, { raised });
  }

  async remove(id: number, ownerId: number): Promise<DeleteResult> {
    const wish = await this.wishRepository.findOneBy({ id });

    if (!wish) throw new NotFoundException();

    if (wish.owner.id !== ownerId) throw new ConflictException();

    return await this.wishRepository.delete({ id });
  }

  async copy(id: number, ownerId: number): Promise<Wish> {
    const wish = await this.wishRepository.findOneBy({ id });

    if (!wish) throw new NotFoundException();

    const dto = {
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
    };

    return await this.create(ownerId, dto);
  }
}
