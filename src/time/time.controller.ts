import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TimeService } from './time.service';
import { CreateTimeDto } from './dto/create-time.dto';
import { UpdateTimeDto } from './dto/update-time.dto';
import { AtGuard } from 'src/users/common/guards/at.guard';
import { GetUser } from 'src/users/common/decorators';
import { Users } from 'src/users/entity/users.entity';

@Controller('time')
export class TimeController {
  constructor(private readonly timeService: TimeService) {}

  @UseGuards(AtGuard)
  @Post('/')
  async chargeTIme(@GetUser() user: Users, @Body() createTimeDto: any) {
    console.log(createTimeDto);
    return await this.timeService.chargeTime(createTimeDto, user);
  }

  @Get()
  findAll() {
    return this.timeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTimeDto: UpdateTimeDto) {
    return this.timeService.update(+id, updateTimeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timeService.remove(+id);
  }
}
