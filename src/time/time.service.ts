import { Injectable } from '@nestjs/common';
import { CreateTimeDto } from './dto/create-time.dto';
import { UpdateTimeDto } from './dto/update-time.dto';
import { TimeRepository } from './time.repository';
import { Users } from 'src/users/entity/users.entity';

@Injectable()
export class TimeService {
  constructor(private readonly timeRepository: TimeRepository) {}
  async chargeTime(createTimeDto: CreateTimeDto, user: Users) {
    return await this.timeRepository.chargeTime(createTimeDto, user);
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
