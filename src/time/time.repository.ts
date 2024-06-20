import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Time } from './entities/time.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTimeDto } from './dto/create-time.dto';

@Injectable()
export class TimeRepository {
  constructor(
    @InjectRepository(Time) private readonly timeRepository: Repository<Time>,
  ) {}

  async chargeTime(createTimeDto: CreateTimeDto, user: any) {
    const time = new Time();

    time.timeTransactionInfo;

    const timeInfo = this.timeRepository.create();
    return await this.timeRepository.save(timeInfo);
  }
}
