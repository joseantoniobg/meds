import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HolidayService } from './holiday.service';
import HolidayDto from './dto/holiday.dto';
import HolidayFiltersDto from './dto/holiday.filters.dto';
import { PageResponseDto } from '../shared/dto/page.response.dto';
import { AccessTokenGuard } from '../shared/guards/access.token.guard';

@ApiTags('Holidays')
@Controller('holidays')
@UseGuards(AccessTokenGuard)
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Realiza o cadastro de um novo feriado',
    type: HolidayDto,
  })
  create(@Body() createHolidayDto: HolidayDto) {
    return this.holidayService.create(createHolidayDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retorna a lista de feriados pesquisados pela descrição',
    type: PageResponseDto<HolidayDto>,
  })
  list(@Query() filters: HolidayFiltersDto) {
    return this.holidayService.findHolidays(filters);
  }

  @Patch(':date')
  @ApiResponse({
    status: 200,
    description: 'Atualiza um feriado',
    type: HolidayDto,
  })
  update(@Param('date') date: Date, @Body() updateHolidayDto: HolidayDto) {
    return this.holidayService.update(date, updateHolidayDto);
  }

  @Delete(':date')
  @ApiResponse({
    status: 201,
    description: 'Remove um feriado',
  })
  remove(@Param('date') date: Date) {
    return this.holidayService.delete(date);
  }
}
