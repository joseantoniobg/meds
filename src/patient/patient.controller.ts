import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import PatientDto from './dto/patient.dto';
import { PageResponseDto } from '../shared/dto/page.response.dto';
import PatientFiltersDto from './dto/patient.filters.dto';
import { AccessTokenGuard } from '../shared/guards/access.token.guard';

@ApiTags('Patients')
@Controller('patients')
@UseGuards(AccessTokenGuard)
export class PatientController {
  constructor(private readonly patientSetvice: PatientService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Realiza o cadastro de um novo paciente',
    type: PatientDto
  })
  create(@Body() createPatientDto: PatientDto) {
    return this.patientSetvice.create(createPatientDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retorna a lista de pacientes pesquisados pelo nome',
    type: PageResponseDto<PatientDto>
  })
  listClients(@Query() filters: PatientFiltersDto) {
    return this.patientSetvice.findPatientsByName(filters);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Atualiza um paciente',
    type: PatientDto
  })
  update(@Param('id') id: string, @Body() updateClientDto: PatientDto) {
    return this.patientSetvice.update(id, updateClientDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 201,
    description: 'Remove um paciente',
  })
  remove(@Param('id') id: string) {
    return this.patientSetvice.delete(id);
  }
}