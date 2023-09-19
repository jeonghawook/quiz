import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany, JoinColumn, IntegerType } from 'typeorm';



@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column()
    @Unique(['nickname'])
    nickname: string;

    @Column()
    userName: string;

    
    @Column()
    @Unique(['userEmail'])
    userEmail: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    refreshToken: string;

    @Column({ default: false })
    isActive: boolean;

    @Column({ default: 0 })
    rank: number;

    @Column({default: false})
    isAdmin : boolean
    
    @Column({ type: 'json', nullable: true }) // Store focus as JSON
    focus: string[] | null;
}