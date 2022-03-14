import { type ConfigModuleOptions } from '@nestjs/config';
import configuration from './configuration';

export const configModuleOptions: ConfigModuleOptions = {
	ignoreEnvFile: true,
	load: [configuration]
}
