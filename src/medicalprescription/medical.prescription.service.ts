import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import MedicalPrescriptionDto from './dto/medical.prescription.dto';
import { MedicalPrescriptionEntity } from './entities/medical.prescription.entity';
import { MedicalPrescriptionMedicineEntity } from './entities/medical.prescription.medicine.entity';
import { MedicalPrescriptionFiltersDto } from './dto/medical.prescription.filters.dto';
import { PageResponseDto } from '../shared/dto/page.response.dto';
import { formatString } from '../shared/utils/functions';
import { MedicalPrescriptionEmissionEntity } from './entities/medical.prescription.emission.dto';

@Injectable()
export class MedicalPrescriptionService {
  constructor(@InjectRepository(MedicalPrescriptionEntity) private readonly medicalPrescriptionRepository: Repository<MedicalPrescriptionEntity>,
              @InjectRepository(MedicalPrescriptionMedicineEntity) private readonly medicalPrescriptionMedicineEntity: Repository<MedicalPrescriptionMedicineEntity>,
              @InjectRepository(MedicalPrescriptionEmissionEntity) private readonly medicalPrescriptionEmissionEntity: Repository<MedicalPrescriptionEmissionEntity>) {}

  async create(medicalPrescriptionDto: MedicalPrescriptionDto): Promise<MedicalPrescriptionEntity> {
   const medicalPrescription = this.medicalPrescriptionRepository.create({
      patientId: medicalPrescriptionDto.patientId,
      initialDate: medicalPrescriptionDto.initialDate,
      renewal: medicalPrescriptionDto.renewal
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
   await this.medicalPrescriptionMedicineEntity.save(medicines);

   medicalPrescriptionSaved.medicines = medicines as any;

   return medicalPrescriptionSaved;
  }

  async findMedicalPrescriptions(medicalPrescriptionFilters: MedicalPrescriptionFiltersDto): Promise<PageResponseDto<MedicalPrescriptionEntity>> {
    const fetchedMedicines = await this.medicalPrescriptionRepository.findAndCount({
      skip: (medicalPrescriptionFilters.page - 1) * medicalPrescriptionFilters.size,
      take: medicalPrescriptionFilters.size,
      where: { patientId: medicalPrescriptionFilters.patientId },
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

  /*<div class="md">
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
        <p class="patient">DAVINA DA CUNHA</p>
      </div>
      <div class="md-body">
        <p class="use-method">USO ORAL:</p>
        <div class="medicine">
          <p class="medicine-name">1) HEMIFUMARATO DE QUETIAPINA 25 MG</p>
          <p class="line"></p>
          <p class="medicine-quantity">2 CAIXAS</p>
        </div>
        <p class="instruction">TOMAR DOIS COMPRIMIDOS POR DIA À NOITE</p>
        <p class="use-method">USO ORAL:</p>
        <div class="medicine">
          <p class="medicine-name">2) OXALATO DE ESCITALOPRAM 10 MG</p>
          <p class="line"></p>
          <p class="medicine-quantity">1 CAIXA</p>
        </div>
        <p class="instruction">TOMAR UM COMPRIMIDO PELA MANHÃ</p>
      </div>
      <div class="md-footer">
        <p>25/04/2025</p>
        <p class="signature">ASSINATURA DO MÉDICO - CRM</p>
    </div>
  </div>*/

  async dailyPrescriptionsEmission() {
    const medicalPrescriptions = await this.medicalPrescriptionRepository.queryRunner.query(`
       SELECT t.id,
         CONCAT('<div class="md">
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
                               '), ''),
             '<div class="md-footer">
			        <p>', TO_CHAR(CURRENT_DATE, 'DD/MM/YYYY'), '</p>
			        <p class="signature">ASSINATURA DO MÉDICO - CRM</p>
			    </div>
			  </div>') as html
	  from (select
	        mp.id,
	        p.name,
	        m.use_method,
	        COUNT(1) OVER (PARTITION BY m.use_method order by m.name) as row_med,
	        CONCAT(COUNT(1) OVER (PARTITION BY m.use_method order by m.name), ') ', m.name) as med_name,
	        mpm.quantity,
	        mpm.instruction_of_use
      FROM medical_prescription mp
      JOIN medical_prescription_medicine mpm ON mp.id = mpm.id_medical_prescription
      JOIN patient p ON mp.id_patient = p.id
      JOIN medicine m ON m.id = mpm.id_medicine
      WHERE mp."status" = 1
      AND mp.deleted_at IS null) t
      group by t.name, t.id`);
  }
}