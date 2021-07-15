import {Chat, Message} from 'grammy/out/platform';
import {Client} from './client';
import {User} from './user';
import {Context} from 'grammy';

export type ChannelType = 'group';

export class Channel {
  client?: Client;
  id: number;
  dateCreated: Date;
  title: string;
  type: ChannelType;
  // TODO : We could use a map here for quicker indexing, but this array is expected to have less than 10 entries, so it's not needed.
  authorizedUsers: User[];
  public lastKeyboardMessageId?: number;

  constructor(id: number, title: string, type: ChannelType, client?: Client, authorizedUsers: User[] = []) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.dateCreated = new Date();
    if (client) this.client = client;
    this.authorizedUsers = authorizedUsers;
  }

  public addAuthorizedUser(user: User) {
    this.authorizedUsers.push(user);
  }

  public removeAuthorizedUsers(userToRemove: User) {
    this.authorizedUsers = this.authorizedUsers.filter(user => user.id == userToRemove.id);
  }

  public static fromContext({message}: Context): Channel {
    if (!message) throw new Error('No message defined for received context, this shouldn\'t happen.');

    const {id, title, type} = message.chat as Chat.GroupChat;
    console.log(`Creating channel from context ${id}, ${title}, ${type}`);

    return new Channel(id, title, type);
  }
}
