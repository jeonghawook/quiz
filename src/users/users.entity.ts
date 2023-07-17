// import { Records } from 'src/records/records.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany, JoinColumn, IntegerType } from 'typeorm';



@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column()
    nickname: string;

    @Column()
    userName: string;

    @Column(Unique)
    userEmail: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    refreshToken: string;

    @Column({ default: false })
    isActive: boolean;

    @Column({ default: 0 })
    rank: number;

}