import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { INSUFFICIENT_ERROR, WISHLIST_NOT_FOUND } from 'src/config/errors';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  async create(
    userId: number,
    createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const user = await this.usersService.findOne(userId);
    const wishes = await Promise.all(
      createWishlistDto.itemsId.map(async (item) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { owner, offers, ...wish } = await this.wishesService.findOne(
          item,
        );
        return wish;
      }),
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, ...rest } = user;
    const wishlist = this.wishlistRepository.create({
      owner: rest,
      items: wishes,
      ...createWishlistDto,
    });

    return this.wishlistRepository.save(wishlist);
  }

  async findAll(): Promise<Wishlist[]> {
    const wishlists = await this.wishlistRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });

    wishlists.forEach((item) => {
      delete item.owner.email;
      delete item.owner.password;
    });

    return wishlists;
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        items: true,
      },
    });

    if (!wishlist) throw new NotFoundException(WISHLIST_NOT_FOUND);

    delete wishlist.owner.email;
    delete wishlist.owner.password;

    return wishlist;
  }

  async update(
    id: number,
    userId: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    const wishlist = await this.findOne(id);

    if (wishlist.owner.id !== userId)
      throw new ConflictException(INSUFFICIENT_ERROR);

    const wishes = await Promise.all(
      updateWishlistDto.itemsId.map(async (item) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { owner, offers, ...wish } = await this.wishesService.findOne(
          item,
        );
        return wish;
      }),
    );

    const wishlistData = {
      name: updateWishlistDto.name,
      image: updateWishlistDto.image,
      description: updateWishlistDto.description,
      items: wishes,
      ...wishlist,
    };

    await this.wishlistRepository.update({ id }, wishlistData);

    return await this.findOne(id);
  }

  async remove(id: number, userId: number): Promise<Wishlist> {
    const wishlist = await this.findOne(id);

    if (wishlist.owner.id !== userId)
      throw new ConflictException(INSUFFICIENT_ERROR);

    this.wishlistRepository.delete({ id });

    return wishlist;
  }
}
