import { IsNumber, IsString, IsUrl, Length } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Wish {
  // id
  @PrimaryGeneratedColumn()
  id: number;

  // createdAt
  @Column()
  createdAt: Date;

  // updatedAt
  @Column()
  updatedAt: Date;

  // name
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  // link
  @Column()
  @IsString()
  link: string;

  // image
  @Column()
  @IsUrl()
  image: string;

  // price
  @Column({
    transformer: {
      from(value: number) {
        return value;
      },
      to(value: number) {
        return value.toFixed(2);
      },
    },
  })
  @IsNumber()
  price: number;

  // raised
  @Column({
    transformer: {
      from(value: number) {
        return value;
      },
      to(value: number) {
        return value.toFixed(2);
      },
    },
  })
  @IsNumber()
  raised: number;

  // description
  @Column()
  @IsString()
  @Length(1, 1024)
  description: string;

  // copied
  @Column('int', { default: 0 })
  @IsNumber()
  copied: number;

  // relationships
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer)
  offers: Offer[];
}
