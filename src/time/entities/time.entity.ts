import { Users } from 'src/users/entity/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Time {
  @PrimaryGeneratedColumn()
  timeId: number;

  @Column({ nullable: true })
  timeCharged: number;

  @Column({ nullable: true })
  timeUsed: number;

  @Column({
    type: 'enum',
    enum: ['google', 'ios', 'study', 'likes', 'purchase', 'comment'],
    nullable: true,
  })
  timeTransactionInfo:
    | 'google'
    | 'ios'
    | 'study'
    | 'likes'
    | 'purchase'
    | 'comment';

  @ManyToOne(() => Users, (users) => users.time, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  users: Users;

  @Column()
  userId: number;
}