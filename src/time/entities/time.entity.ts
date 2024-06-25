import { Users } from 'src/users/entity/users.entity';
import {
  Column,
  CreateDateColumn,
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

  @Column()
  timeTransactionInfo: string;

  @ManyToOne(() => Users, (users) => users.time, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  users: Users;

  @Column()
  userId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ nullable: true })
  purchaseID: string;

  @Column({ nullable: true })
  productID: string;

  @Column({ nullable: true })
  transactionDate: String;

  @Column({ nullable: true })
  status: string;
}
