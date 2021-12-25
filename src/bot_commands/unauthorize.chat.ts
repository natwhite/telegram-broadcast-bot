import {Channel} from '../interface/telegram/channel';
import {DataService} from '../services/data.service';
import {Context} from 'grammy';

export async function UnauthorizeChat(context: Context) {
  const channel = Channel.fromContext(context);

  await DataService
    .removeAdminChannel(channel)
    .saveDatabase();

  await context.reply(`Removed channel ${channel.title} from list of admin channels`);
}