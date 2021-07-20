import {FileService} from '../services/file.service';

const configFile = 'config.json';

export class Configuration {
  static indent = 4;
  static botToken: string = 'Put-Your-Bot-API_TOKEN-here';

  static async loadConfig(): Promise<Configuration> {
    const configFileExists = await FileService.fileExists(configFile);

    console.log(`Configuration file exists? ${configFileExists}`);
    if (!configFileExists) {
      await Configuration.saveConfig();
    } else {
      const configuration = await FileService.loadFile<Configuration>(configFile);
      Object.assign(Configuration, configuration);
    }

    return Configuration;
  };

  static async saveConfig() {
    return await FileService.saveFile<Configuration>(configFile, Configuration);
  }
}
