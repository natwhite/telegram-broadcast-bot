import {Context} from 'grammy';
import {Chat} from 'grammy/out/platform';
import {checkChannelIsTracked} from '../lib/context.functions';
import {DataService} from '../services/data.service';
import {Channel} from '../interface/telegram/channel';

export async function InitializeChat(context: Context) {
  const chat = context.message!.chat as Chat.GroupChat;

  if (checkChannelIsTracked(chat)) return context.reply('Channel has already been initialized.');

  const channel = Channel.fromContext(context);

  DataService.addChannel(channel);

  await DataService.saveDatabase();

  return context.reply('Channel initialized successfully.');
}