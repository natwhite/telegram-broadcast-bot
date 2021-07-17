export class ChannelGroup {
  name: string;
  channelsIds: number[];

  constructor(name: string, initialChannels: number[] = []) {
    this.name = name;
    this.channelsIds = initialChannels;
  }
}
