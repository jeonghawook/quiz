import { Injectable } from '@nestjs/common';
import { CreateTimeDto } from './dto/create-time.dto';
import { UpdateTimeDto } from './dto/update-time.dto';
import { TimeRepository } from './time.repository';
import { Users } from 'src/users/entity/users.entity';
import { Time } from './entities/time.entity';

@Injectable()
export class TimeService {
  constructor(private readonly timeRepository: TimeRepository) {}
  async chargeTime(createTimeDto: any, user: Users) {
    const time = new Time();

    time.timeTransactionInfo = createTimeDto.purchaseID
      ? 'in-app-purchase'
      : 'other';

    time.transactionDate = createTimeDto.transactionDate ?? new Date();
    time.purchaseID = createTimeDto.purchaseID ?? null;
    time.status = createTimeDto.status ?? null;
    time.verificationData = createTimeDto.verificationData ?? null;
    time.userId = user.userId;

    if (createTimeDto.productID) {
      time.productID = createTimeDto.productID ?? null;
      const parts = createTimeDto.productID.split('_');
      time.timeCharged = parseInt(parts[1]) ?? null;
    }

    return await this.timeRepository.chargeTime(time);
  }

  findAll() {
    return `This action returns all time`;
  }

  findOne(id: number) {
    return `This action returns a #${id} time`;
  }

  update(id: number, updateTimeDto: UpdateTimeDto) {
    return `This action updates a #${id} time`;
  }

  remove(id: number) {
    return `This action removes a #${id} time`;
  }
}
