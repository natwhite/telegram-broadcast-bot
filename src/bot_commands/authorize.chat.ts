import {Channel} from '../interface/telegram/channel';
import {DataService} from '../services/data.service';
import {Context} from 'grammy';

export async function AuthorizeChat(context: Context) {

  const channel = Channel.fromContext(context);

  await DataService
    .addAdminChannel(channel)
    .saveDatabase();

  await context.reply(`Added channel ${channel.title} to list of admin channels`);
}