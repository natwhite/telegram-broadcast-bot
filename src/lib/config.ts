import {FileService} from '../services/file.service';

const configFile = 'config.json';

export interface AuthorizedAdmin {
  id: number;
  name: string;
}

export class Configuration {
  static indent = 4;
  static botToken: string;
  static authorizedAdmins: AuthorizedAdmin[];

  static async loadConfig(): Promise<Configuration> {
    const configuration = await FileService.loadFile<Configuration>(configFile);
    Object.assign(Configuration, configuration);
    return Configuration;
  };

  static async saveConfig() {
    return await FileService.saveFile<Configuration>(configFile, Configuration);
  }
}
