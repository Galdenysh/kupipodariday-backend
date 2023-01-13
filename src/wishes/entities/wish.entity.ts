import { IsDate, IsNumber, IsString, IsUrl, Length } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { toFixed } from 'src/utils/toFixed';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wish {
  // id
  @PrimaryGeneratedColumn()
  id: number;

  // createdAt
  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  // updatedAt
  @UpdateDateColumn()
  @IsDate()
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
    type: 'numeric',
    transformer: {
      from(value: number) {
        return value;
      },
      to(value: number) {
        return toFixed(value, 2);
      },
    },
  })
  price: number;

  // raised
  @Column({
    type: 'numeric',
    default: 0,
    transformer: {
      from(value: number) {
        return value;
      },
      to(value: number) {
        return toFixed(value, 2);
      },
    },
  })
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

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
