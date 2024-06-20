import { Module } from '@nestjs/common';
import { TimeService } from './time.service';
import { TimeController } from './time.controller';
import { TimeRepository } from './time.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Time } from './entities/time.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Time])],
  controllers: [TimeController],
  providers: [TimeService, TimeRepository],
})
export class TimeModule {}
