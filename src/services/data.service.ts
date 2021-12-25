import {Channel, Client, User} from '../interface/telegram';
import {FileService} from './file.service';
import {ChannelGroup} from '../interface/ChannelGroup';
import {Context} from 'grammy';
import {Chat} from 'grammy/out/platform';

class DataStorage {
  public static channels: Channel[] = [];
  public static globalAdmins: User[] = [];
  public static adminChats: Channel[] = [];
  public static channelGroups: ChannelGroup[] = [];
}

const dataFile = 'dataStore.json';

export class DataService {
  public static async loadDatabase(): Promise<DataStorage> {
    const dataStoreExists = await FileService.fileExists(dataFile);

    if (!dataStoreExists) {
      await DataService.saveDatabase();
    } else {
      const dataStore = await FileService.loadFile<DataStorage>(dataFile);
      Object.assign(DataStorage, dataStore);
    }

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

  public static getChannelByName(channelTitle: string): Channel | undefined {
    return DataStorage.channels.find(channel => channel.title == channelTitle);
  }

  public static getChannelFromContext(context: Context): Channel {
    let message = context.message;
    if (!message)
      throw new Error('Message should not be undefined in this context');

    const chat: Chat.GroupChat = message.chat as Chat.GroupChat;
    let channel = DataStorage.channels.find(channel => channel.id == chat.id);

    if (!channel)
      throw new Error('Channel should not be undefined in this context');

    return channel;
  }

  public static getClientChannels(): readonly Channel[] {
    return DataStorage.channels.filter(channel => !!channel.client).slice();
  }

  public static getAdminChannels(): readonly Channel[] {
    // return Object.freeze(DataStorage.adminChats);
    return DataStorage.adminChats.slice();
  }

  public static getGroups(): readonly ChannelGroup[] {
    return DataStorage.channelGroups.slice();
  }

  public static getGroupByName(groupName: string): ChannelGroup | undefined {
    return DataStorage.channelGroups.find(group => group.name == groupName);
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
