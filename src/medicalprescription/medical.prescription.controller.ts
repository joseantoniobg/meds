import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MedicalPrescriptionService } from './medical.prescription.service';
import { PageResponseDto } from '../shared/dto/page.response.dto';
import { AccessTokenGuard } from '../shared/guards/access.token.guard';
import MedicalPrescriptionDto from './dto/medical.prescription.dto';
import { MedicalPrescriptionFiltersDto } from './dto/medical.prescription.filters.dto';

@ApiTags('Medical Prescriptions')
@Controller('medicalPrescriptions')
@UseGuards(AccessTokenGuard)
export class MedicalPrescriptionController {
  constructor(private readonly medicalPrescriptionService: MedicalPrescriptionService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Realiza o cadastro de um nova prescrição médica',
    type: MedicalPrescriptionDto
  })
  create(@Body() createMedicalPrescriptionDto: MedicalPrescriptionDto) {
    return this.medicalPrescriptionService.create(createMedicalPrescriptionDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retorna a lista de prescrições médicas pesquisadas',
    type: PageResponseDto<MedicalPrescriptionDto>
  })
  listPrescriptions(@Query() filters: MedicalPrescriptionFiltersDto) {
    return this.medicalPrescriptionService.findMedicalPrescriptions(filters);
  }
}