import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MedicineService } from './medicine.service';
import PatientDto from './dto/medicine.dto';
import { PageResponseDto } from '../shared/dto/page.response.dto';
import PatientFiltersDto from './dto/medicine.filters.dto';
import { AccessTokenGuard } from '../shared/guards/access.token.guard';

@ApiTags('Medicines')
@Controller('medicines')
@UseGuards(AccessTokenGuard)
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Realiza o cadastro de um novo medicamento',
    type: PatientDto
  })
  create(@Body() createPatientDto: PatientDto) {
    return this.medicineService.create(createPatientDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retorna a lista de medicamentos pesquisados pelo nome',
    type: PageResponseDto<PatientDto>
  })
  listClients(@Query() filters: PatientFiltersDto) {
    return this.medicineService.findMedicinesByName(filters);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Atualiza um medicamento',
    type: PatientDto
  })
  update(@Param('id') id: string, @Body() updateClientDto: PatientDto) {
    return this.medicineService.update(id, updateClientDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 201,
    description: 'Remove um medicamento',
  })
  remove(@Param('id') id: string) {
    return this.medicineService.delete(id);
  }
}