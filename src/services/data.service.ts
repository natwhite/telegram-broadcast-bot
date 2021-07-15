import {Channel, Client, User} from '../interface/telegram';
import {FileService} from './file.service';
import {indent} from '../lib/functions';

class DataStorage {
  public static channels: Channel[] = [];
  public static globalAdmins: User[] = [];
  public static adminChats: Channel[] = [];
}

const dataFile = 'dataStore.json';

export class DataService {
  public static async loadDatabase(): Promise<DataStorage> {
    const dataStore = await FileService.loadFile<DataStorage>(dataFile);

    console.log(JSON.stringify(dataStore, null, 4));

    Object.assign(DataStorage, dataStore);
    return DataStorage;
  };

  public static async saveDatabase(): Promise<void> {
    await FileService.saveFile<DataStorage>(dataFile, DataStorage);
  };

  public static getAuthorizedAdmins(): readonly User[] {
    return Object.freeze(DataStorage.globalAdmins);
  }

  // TODO : This needs to be frozen before it is released, but ideally we would never expose the underlying datastore.
  public static getChannels(): readonly Channel[] {
    return DataStorage.channels;
    // return Object.freeze(DataStorage.channels);
  }

  public static getClientChannels(): readonly Channel[] {
    return Object.freeze(DataStorage.channels.filter(channel => channel.client));
  }

  public static getAdminChannels(): readonly Channel[] {
    // return Object.freeze(DataStorage.adminChats);
    return DataStorage.adminChats
  }

  public static addChannel(channel: Channel) {
    DataStorage.channels.push(channel);
  };

  public static configureClient(channel: Channel, client: Client): void {
    const matchedChannel = DataStorage.channels.find(c => c.id == channel.id);

    if (!matchedChannel) {
      throw new Error(`Could not find matching channel to assign Client to!`);
    }

    matchedChannel.client = client;
  }

  public static addAdminChannel(channel: Channel) {
    DataStorage.adminChats.push(channel);
  }

  public static removeAdminChannel(channel: Channel) {
    const channelIndex = DataStorage.adminChats.findIndex(chat => chat.id == channel.id)

    console.log(`Remove channel ${channel.title} from admins list at index ${channelIndex}.`)
    if (channelIndex < 0) throw new Error("Channel does not exist in the admin channel list");

    DataStorage.adminChats.splice(channelIndex);
  }
}
