import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  async create(userId: number, createOfferDto: CreateOfferDto): Promise<Offer> {
    const user = await this.usersService.findOne(userId);
    const wish = await this.wishesService.findOne(createOfferDto.itemId);

    if (!user) throw new NotFoundException();

    if (!wish) throw new NotFoundException();

    if (wish.owner.id === userId) throw new ConflictException();

    const raised = Number(createOfferDto.amount) + Number(wish.raised);

    if (raised > wish.price) throw new ConflictException();

    await this.wishesService.updateRaised(wish.id, raised);

    const offerData = {
      user,
      item: wish,
      ...createOfferDto,
    };

    delete offerData.user.email;
    delete offerData.user.password;

    const offer = this.offerRepository.create(offerData);

    return await this.offerRepository.save(offer);
  }

  async findAll(): Promise<Offer[]> {
    const offers = await this.offerRepository.find({
      relations: {
        item: true,
        user: true,
      },
    });

    offers.forEach((item) => {
      delete item.user.email;
      delete item.user.password;
    });

    return offers;
  }

  async findOne(id: number): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: {
        item: true,
        user: true,
      },
    });

    delete offer.user.email;
    delete offer.user.password;

    return offer;
  }
}
