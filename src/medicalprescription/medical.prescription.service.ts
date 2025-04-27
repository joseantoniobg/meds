import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import MedicalPrescriptionDto from './dto/medical.prescription.dto';
import { MedicalPrescriptionEntity } from './entities/medical.prescription.entity';
import { MedicalPrescriptionMedicineEntity } from './entities/medical.prescription.medicine.entity';
import { MedicalPrescriptionFiltersDto } from './dto/medical.prescription.filters.dto';
import { PageResponseDto } from '../shared/dto/page.response.dto';
import { formatString } from '../shared/utils/functions';
import { MedicalPrescriptionEmissionEntity } from './entities/medical.prescription.emission.entity';
import { MedicalPrescriptionEmissionBatchEntity } from './entities/medical.prescription.emission.batch.entity';
import EmitMedicalPrescriptionFiltersDto from './dto/emit.medical.prescriptions.filters.dto';
import MedicalPrescriptionEmissionDto from './dto/medical.prescription.emission.dto';
import { Response } from 'express';
import { TokenPayloadDto } from '../shared/dto/token.payload.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class MedicalPrescriptionService {
  constructor(@InjectRepository(MedicalPrescriptionEntity) private readonly medicalPrescriptionRepository: Repository<MedicalPrescriptionEntity>,
              @InjectRepository(MedicalPrescriptionMedicineEntity) private readonly medicalPrescriptionMedicineRepository: Repository<MedicalPrescriptionMedicineEntity>,
              @InjectRepository(MedicalPrescriptionEmissionEntity) private readonly medicalPrescriptionEmissionRepository: Repository<MedicalPrescriptionEmissionEntity>,
              @InjectRepository(MedicalPrescriptionEmissionBatchEntity) private readonly medicalPrescriptionEmissionBatchRepository: Repository<MedicalPrescriptionEmissionBatchEntity>,
              private readonly userService: UserService) {}

  async create(medicalPrescriptionDto: MedicalPrescriptionDto, token: TokenPayloadDto): Promise<MedicalPrescriptionEntity> {
    const user = await this.userService.getById(token.id);

    if (!user) {
      throw new HttpException('Usuário não encontrado', 400);
    }

   const medicalPrescription = this.medicalPrescriptionRepository.create({
      patientId: medicalPrescriptionDto.patientId,
      initialDate: medicalPrescriptionDto.initialDate,
      renewal: medicalPrescriptionDto.renewal,
      userId: user.id,
   });

   const medicalPrescriptionSaved = await this.medicalPrescriptionRepository.save(medicalPrescription);
   const medicines = medicalPrescriptionDto.medicines.map(medicine => {
      return {
        idMedicalPrescription: medicalPrescriptionSaved.id,
        idMedicine: medicine.id,
        instructionOfUse: formatString(medicine.instructionOfUse),
        quantity: medicine.quantity.toUpperCase()
      }
   }
   );
   await this.medicalPrescriptionMedicineRepository.save(medicines);

   medicalPrescriptionSaved.medicines = medicines as any;

   return medicalPrescriptionSaved;
  }

  async findMedicalPrescriptions(medicalPrescriptionFilters: MedicalPrescriptionFiltersDto): Promise<PageResponseDto<MedicalPrescriptionEntity>> {
    let medicalPrescriptions: PageResponseDto<MedicalPrescriptionEmissionDto>;

    if (medicalPrescriptionFilters.dailyEmission) {
        medicalPrescriptions = await this.emitMedicalPrescriptions({
          dailyEmission: true,
          page: medicalPrescriptionFilters.page,
          size: medicalPrescriptionFilters.size,
          patientId: null,
          medicalPrescriptionId: null,
          date: medicalPrescriptionFilters.date ?? new Date(),
        });
    }

    const fetchedMedicines = await this.medicalPrescriptionRepository.findAndCount({
      skip: (medicalPrescriptionFilters.page - 1) * medicalPrescriptionFilters.size,
      take: medicalPrescriptionFilters.size,
      where: { patientId: medicalPrescriptionFilters.patientId, id: medicalPrescriptions ? In(medicalPrescriptions.content.map (i => i.id)) : null },
      order: { createdAt: 'ASC' },
      relations: ['medicines', 'medicines.medicine', 'patient'],
      select: {
        id: true,
        initialDate: true,
        renewal: true,
        status: true,
        createdAt: true,
        patient: {
          id: true,
          name: true,
        },
        medicines: {
          idMedicine: true,
          instructionOfUse: true,
          quantity: true,
          medicine: {
            name: true,
            useMethod: true,
          }
        }
      }
    });

    return {
      content: fetchedMedicines[0],
      totalRecords: fetchedMedicines[1],
      totalPages: Math.ceil(fetchedMedicines[1] / medicalPrescriptionFilters.size),
      page: medicalPrescriptionFilters.page,
      size: medicalPrescriptionFilters.size,
    }
  }

  async emitMedicalPrescriptions(emissionFilters: EmitMedicalPrescriptionFiltersDto): Promise<PageResponseDto<MedicalPrescriptionEmissionDto>> {
    const filters = Array();

    filters.push(emissionFilters.date);

    const queryRunner = this.medicalPrescriptionEmissionRepository.manager.connection.createQueryRunner();

    let sql = `SELECT COUNT(1) OVER () as total,
         t.id,
         REGEXP_REPLACE(CONCAT('<div class="md">
	              <div class="md-header">
	                <div>
	                  <img class="logo" src="https://seeklogo.com/images/S/sus-logo-E2EA177DC0-seeklogo.com.png" alt="Logo">
	                </div>
	                <div class="title">
	                  <h4>PREFEITURA MUNICIPAL DE PRATÁPOLIS</h4>
	                  <p>PSF 2 – SÃO FRANCISCO DE ASSIS</p>
	                  <p>TELEFONE:3533-1415</p>
	                  <p>CENTRO</p>
	                </div>
	              </div>
				  <div class="md-patient">
			        <p>Nome:</p>
			        <p class="patient">', t.name, '</p>
			      </div>
			      <div class="md-body">
                  ',
         			STRING_AGG(CONCAT(case when t.row_med = 1 then CONCAT('<p class="use-method">', t.use_method, ':</p>
                   ') else '' end,
						        '<div class="medicine">
						          <p class="medicine-name">', t.med_name, '</p>
						          <p class="line"></p>
						          <p class="medicine-quantity">', t.quantity, '</p>
						        </div>
						        <p class="instruction">', t.instruction_of_use, '.</p>
                               '), '' ORDER BY t.use_method, t.row_med ASC),
             '</div>
             <div class="md-footer">
			        <p>', TO_CHAR($1::DATE, 'DD/MM/YYYY'), '</p>
			        <p class="signature"> DR. ', t.username, '<br>', t.crm, '</p>
			    </div>
			  </div>'), E'[\\n\\r\\t]+', '', 'g') as html
	  from (select
	        mp.id,
	        p.name,
	        m.use_method,
	        COUNT(1) OVER (PARTITION BY mp.id, m.use_method order by m.use_method, m.name) as row_med,
	        CONCAT(COUNT(1) OVER (PARTITION BY mp.id, m.use_method order by m.use_method, m.name), ') ', m.name) as med_name,
	        mpm.quantity,
	        mpm.instruction_of_use,
          u.name AS username,
          u.crm
      FROM medical_prescription mp
      JOIN medical_prescription_medicine mpm ON mp.id = mpm.id_medical_prescription
      JOIN patient p ON mp.id_patient = p.id
      JOIN medicine m ON m.id = mpm.id_medicine
      JOIN "user" u ON mp.id_user = u.id
      LEFT JOIN medical_prescription_emission mpe on mpe.id_medical_prescription = mp.id
      WHERE 1 = 1`;

    if (emissionFilters.medicalPrescriptionId) {
      sql += ` and mp.id = $${filters.length + 1}`;
      filters.push(emissionFilters.medicalPrescriptionId);
    }

    if (emissionFilters.patientId) {
      sql += ` and p.id = $${filters.length + 1}`;
      filters.push(emissionFilters.patientId);
    }

    if (emissionFilters.dailyEmission) {
      sql += ` and next_working_day((coalesce(mpe.date, mp.initial_date) + mp.renewal * interval '1 day')::DATE) = now()::DATE`;
    }

    sql += `) t
      group by t.name, t.id, t.username, t.crm
      order by t.name, t.id
      offset ${(emissionFilters.page - 1) * emissionFilters.size} limit ${emissionFilters.size}`;

    const medicalPrescriptions = await queryRunner.query(sql, filters);

    await queryRunner.release();

    const total = medicalPrescriptions.length > 0 ? +medicalPrescriptions[0].total : 0;

    return {
      content: medicalPrescriptions.map((mp) => {
        delete mp.total;
        return mp;
      }),
      totalRecords: total,
      totalPages: Math.ceil(total / emissionFilters.size),
      page: emissionFilters.page,
      size: emissionFilters.size,
    }
  }

  async printMedicalPrescriptions(emissionFilters: EmitMedicalPrescriptionFiltersDto, response: Response) {
    const medicalPrescriptions = await this.emitMedicalPrescriptions(emissionFilters);

    const batch = await this.medicalPrescriptionEmissionBatchRepository.save({
      isDailyEmission: emissionFilters.dailyEmission,
      date: new Date(),
    });

    const emission = this.medicalPrescriptionEmissionRepository.create(medicalPrescriptions.content.map((mp) => ({
      batchId: batch.id,
      medicalPrescriptionId: mp.id,
      isDailyEmission: emissionFilters.dailyEmission,
      date: new Date(),
      html: mp.html,
    })));

    const html = `<!DOCTYPE html>
            <html lang="pt-Br">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>MDs</title>
            </head>
            <style>
              body {
                display: grid;
                grid-template-columns: repeat(2, 15cm);
              }

              .md {
                width: 15cm;
                height: 20cm;
                border-right: 1px solid black;
              }

              .md-header {
                display: flex;
                justify-content: space-between;
                padding: 1cm;
              }

              .logo {
                max-height: 110px;
                padding-left: 20px;
              }

              .title {
                margin-top: -5px;
                text-align: center;
                line-height: 0.2;
              }

              .md-patient {
                display: flex;
                justify-content: start;
                padding: 0 1cm;
                margin-bottom: -20px;
              }

              .patient {
                font-weight: bold;
                border-bottom: 1px solid black;
                width: 100%;
                margin-left: 10px;
              }

              .md-footer {
                display: flex;
                justify-content: space-between;
                padding: 0 1cm 1cm 1cm;
              }

              .signature {
                width: 300px;
                border-top: 1px solid black;
                text-align: center;
                padding-top: 5px;
              }

              .md-body {
                height: 11cm;
                padding: 0 1cm;
                line-height: 0;
              }

              .instruction {
                font-size: 10pt;
                margin-top: -2px;
                margin-left: 15px;
              }

              .medicine {
                display: flex;
                justify-content: space-between;
              }

              .medicine-name {
                font-weight: bold;
              }

              .use-method {
                font-size: 16pt;
                margin-top: 30px;
                margin-bottom: 15px;
              }

              .medicine-name, .medicine-quantity {
                flex-shrink: 0;
              }

              .line {
                flex-grow: 1;
                border-bottom: 1px dashed black;
                margin-left: 5px;
                margin-right: 5px;
                margin-top: 20px;
              }
            </style>
            <body>
                ${medicalPrescriptions.content.map((mp) => mp.html).join('')}
            </body>
          </html>`;

    response.setHeader('Content-Type', 'text/html');
    response.send(html);
  }
}