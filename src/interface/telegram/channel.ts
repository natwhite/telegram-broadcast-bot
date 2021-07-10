import {Client} from './client';

export type ChannelType = 'group';

export class Channel {
  client?: Client;
  id: number;
  dateCreated: Date;
  title: string;
  type: ChannelType;


  constructor(id: number, title: string, type: ChannelType, client?: Client) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.dateCreated = new Date();
    if (client) this.client = client;
  }
}
