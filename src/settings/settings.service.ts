import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemSettingEntity } from './entities/system.setting.entity';
import SystemSettingDto from './dto/system.setting.dto';

@Injectable()
export class SettingsService {
  constructor(@InjectRepository(SystemSettingEntity) private readonly settingsRepository: Repository<SystemSettingEntity>) {}

  async getSettings(): Promise<SystemSettingEntity> {
    return this.settingsRepository.findOneBy({ id: 1 });
  }

  async update(settingDto: SystemSettingDto, readOnly: boolean): Promise<SystemSettingEntity> {
    if (readOnly) {
      throw new HttpException('Acesso negado', 403);
    }

    const settings = await this.getSettings();

    settings.restrictReadOnlyPrint = settingDto.restrictReadOnlyPrint;

    return this.settingsRepository.save(settings);
  }
}
