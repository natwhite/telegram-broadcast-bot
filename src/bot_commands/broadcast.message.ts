import {Api, Context} from 'grammy';
import {parseCommandTextFromContext} from '../lib/context.functions';
import {DataService} from '../services/data.service';

export async function BroadcastMessage(context: Context, api: Api) {

  const rawMessage = parseCommandTextFromContext(context);

  if (!rawMessage) throw new Error('Broadcast message cannot be undefined');

  let splitMessage = rawMessage.trim().split(' ');
  const groupName = splitMessage[0];
  const broadcastMessage = splitMessage.slice(1).join(' ');

  // DataService.getClientChannels().forEach(channel => {
  if (groupName == 'all')
    return await Promise.all(DataService.getChannels().map(({id}) => api.sendMessage(id, broadcastMessage)));

  let channelGroup = DataService.getGroups().find(channelGroup => channelGroup.name == groupName);

  if (!channelGroup)
    return await context.reply(`Unable to find group ${groupName}. You must specify a group name or 'all'`);

  channelGroup.channelsIds.forEach(id => api.sendMessage(id, broadcastMessage));
}