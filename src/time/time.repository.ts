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

  async chargeTime(time: any) {
    const timeInfo = this.timeRepository.create(time);
    return await this.timeRepository.save(timeInfo);
  }
}
