import { IsEmail, IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  // id
  @PrimaryGeneratedColumn()
  id: number;

  // createdAt
  @Column()
  createdAt: Date;

  // updatedAt
  @Column()
  updatedAt: Date;

  // username
  @Column()
  @IsString()
  @Length(2, 30)
  @IsNotEmpty()
  username: string;

  // about
  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsString()
  @Length(2, 200)
  about: string;

  // avatar
  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  // email
  @Column({ unique: true })
  @IsEmail()
  email: string;

  // password
  @Column()
  @IsString()
  password: string;

  // relationships
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
