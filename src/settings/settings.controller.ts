import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import SystemSettingDto from './dto/system.setting.dto';
import { AccessTokenGuard } from '../shared/guards/access.token.guard';
import { TokenPayload } from '../shared/decorators/token.decorator';
import { TokenPayloadDto } from '../shared/dto/token.payload.dto';

@ApiTags('Settings')
@Controller('settings')
@UseGuards(AccessTokenGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retorna as configurações do sistema',
    type: SystemSettingDto,
  })
  getSettings() {
    return this.settingsService.getSettings();
  }

  @Patch()
  @ApiResponse({
    status: 200,
    description: 'Atualiza as configurações do sistema',
    type: SystemSettingDto,
  })
  update(@Body() settingDto: SystemSettingDto, @TokenPayload() token: TokenPayloadDto) {
    return this.settingsService.update(settingDto, token.readOnly);
  }
}
