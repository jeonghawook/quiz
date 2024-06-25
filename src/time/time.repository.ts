import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Time } from './entities/time.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTimeDto } from './dto/create-time.dto';
import { Users } from 'src/users/entity/users.entity';

@Injectable()
export class TimeRepository {
  constructor(
    @InjectRepository(Time) private readonly timeRepository: Repository<Time>,
    private readonly dataSource: DataSource,
  ) {}

  async chargeTime(time: any, user: Users) {
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(time);

      await transactionalEntityManager.increment(
        Users,
        {
          userId: user.userId,
        },
        'totalTime',
        time.timeCharged,
      );
    });
  }
}
