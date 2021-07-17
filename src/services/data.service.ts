import {Channel, Client, User} from '../interface/telegram';
import {FileService} from './file.service';
import {indent} from '../lib/functions';
import {ChannelGroup} from '../interface/ChannelGroup';

class DataStorage {
  public static channels: Channel[] = [];
  public static globalAdmins: User[] = [];
  public static adminChats: Channel[] = [];
  public static channelGroups: ChannelGroup[] = [];
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

  // NOTE : We are using slice here to create a copy of the array before releasing it so we don't expose the underlying DataStore

  public static getAuthorizedAdmins(): readonly User[] {
    return DataStorage.globalAdmins.slice();
  }

  public static getChannels(): readonly Channel[] {
    return DataStorage.channels.slice();
  }

  public static getClientChannels(): readonly Channel[] {
    return DataStorage.channels.filter(channel => channel.client);
  }

  public static getAdminChannels(): readonly Channel[] {
    // return Object.freeze(DataStorage.adminChats);
    return DataStorage.adminChats.slice();
  }

  public static getChannelGroups(): readonly ChannelGroup[] {
    return DataStorage.channelGroups.slice();
  }

  public static getChannelGroupByName(channelGroupName: string): ChannelGroup | undefined {
    return DataStorage.channelGroups.find(channelGroup => channelGroup.name == channelGroupName);
  }

  // NOTE : Functions that affect the state of the DataStorage return the DataService to allow command chaining.

  public static addChannel(channel: Channel): DataService {
    DataStorage.channels.push(channel);
    return DataService;
  };

  public static addChannelToGroup(channel: Channel, groupName: string): DataService {
    const channelGroup = DataStorage.channelGroups.find(channelGroup => channelGroup.name == groupName);

    if (!channelGroup) {
      console.log(`Unable to find existing channel group ${groupName}, creating one instead`);
      const newChannelGroup = new ChannelGroup(groupName, [channel.id]);
      DataStorage.channelGroups.push(newChannelGroup);
    } else {
      channelGroup.channelsIds.push(channel.id);
    }

    return DataService;
  }

  public static configureClient(channel: Channel, client: Client): DataService {
    const matchedChannel = DataStorage.channels.find(c => c.id == channel.id);

    if (!matchedChannel) {
      throw new Error(`Could not find matching channel to assign Client to!`);
    }

    matchedChannel.client = client;
    return DataService;
  }

  public static addAdminChannel(channel: Channel): DataService {
    DataStorage.adminChats.push(channel);
    return DataService;
  }

  public static removeAdminChannel(channel: Channel): DataService {
    const channelIndex = DataStorage.adminChats.findIndex(chat => chat.id == channel.id);

    console.log(`Remove channel ${channel.title} from admins list at index ${channelIndex}.`);
    if (channelIndex < 0) throw new Error('Channel does not exist in the admin channel list');

    DataStorage.adminChats.splice(channelIndex);
    return DataService;
  }

  // Local reference to a static function to allow saving the database using command chaining.

  saveDatabase = () => DataService.saveDatabase();
}
