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

  async chargeTime(createTimeDto: any, user: any) {
    const time = new Time();

    createTimeDto.purchaseID
      ? (time.timeTransactionInfo = 'in-app-purchase')
      : (time.timeTransactionInfo = 'other');

    time.productID = createTimeDto.productID;
    time.transactionDate = createTimeDto.transactionDate;
    time.purchaseID = createTimeDto.purchaseID;
    time.status = createTimeDto.status;

    const timeInfo = this.timeRepository.create(time);
    return await this.timeRepository.save(timeInfo);
  }
}
