import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TimeService } from './time.service';
import { CreateTimeDto } from './dto/create-time.dto';
import { UpdateTimeDto } from './dto/update-time.dto';

@Controller('time')
export class TimeController {
  constructor(private readonly timeService: TimeService) {}

  @Post()
  create(@Body() createTimeDto: CreateTimeDto) {
    return this.timeService.create(createTimeDto);
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
