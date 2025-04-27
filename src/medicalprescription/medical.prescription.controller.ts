import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MedicalPrescriptionService } from './medical.prescription.service';
import { PageResponseDto } from '../shared/dto/page.response.dto';
import { AccessTokenGuard } from '../shared/guards/access.token.guard';
import MedicalPrescriptionDto from './dto/medical.prescription.dto';
import { MedicalPrescriptionFiltersDto } from './dto/medical.prescription.filters.dto';
import EmitMedicalPrescriptionFiltersDto from './dto/emit.medical.prescriptions.filters.dto';
import MedicalPrescriptionEmissionDto from './dto/medical.prescription.emission.dto';
import { Response, Request } from 'express';
import { TokenPayload } from '../shared/decorators/token.decorator';
import { TokenPayloadDto } from '../shared/dto/token.payload.dto';

@ApiTags('Medical Prescriptions')
@Controller('medicalPrescriptions')
@UseGuards(AccessTokenGuard)
export class MedicalPrescriptionController {
  constructor(
    private readonly medicalPrescriptionService: MedicalPrescriptionService,
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Realiza o cadastro de um nova prescrição médica',
    type: MedicalPrescriptionDto,
  })
  create(
    @Body() createMedicalPrescriptionDto: MedicalPrescriptionDto,
    @TokenPayload() token: TokenPayloadDto,
  ) {
    return this.medicalPrescriptionService.create(createMedicalPrescriptionDto, token);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retorna a lista de prescrições médicas pesquisadas',
    type: PageResponseDto<MedicalPrescriptionDto>,
  })
  listPrescriptions(@Query() filters: MedicalPrescriptionFiltersDto) {
    return this.medicalPrescriptionService.findMedicalPrescriptions(filters);
  }

  @Get('emission')
  @ApiResponse({
    status: 200,
    description: 'Emite as receitas desejadas',
    type: PageResponseDto<MedicalPrescriptionEmissionDto>,
  })
  emitPrescriptions(@Query() filters: EmitMedicalPrescriptionFiltersDto) {
    console.log(filters);
    return;
    return this.medicalPrescriptionService.emitMedicalPrescriptions(filters);
  }

  @Get('print')
  @ApiResponse({
    status: 200,
    description: 'Imprime as receitas desejadas',
    type: PageResponseDto<MedicalPrescriptionEmissionDto>,
  })
  async printPrescriptions(
    @Query() filters: EmitMedicalPrescriptionFiltersDto,
    @Res() res: Response,
  ) {
    return this.medicalPrescriptionService.printMedicalPrescriptions(
      filters,
      res,
    );
  }
}
