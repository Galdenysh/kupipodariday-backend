import { IsBoolean, IsNumber } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Offer {
  // id
  @PrimaryGeneratedColumn()
  id: number;

  // createdAt
  @Column()
  createdAt: Date;

  // updatedAt
  @Column()
  updatedAt: Date;

  // amount
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
  amount: number;

  // hidden
  @Column('boolean', { default: false })
  @IsBoolean()
  hidden: boolean;

  // relationships
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;
}
