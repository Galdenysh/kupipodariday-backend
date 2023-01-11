import { IsString, IsUrl, Length } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Wishlist {
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

  // description
  @Column()
  @IsString()
  @Length(1, 1500)
  description: string;

  // image
  @Column()
  @IsUrl()
  image: string;

  // relationships
  @ManyToMany(() => Wish, (wish) => wish)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
