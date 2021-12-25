import {Context} from 'grammy';
import {parseCommandTextFromContext} from '../lib/context.functions';
import {DataService} from '../services/data.service';

export async function AddChatToGroup(context: Context) {
  const commandText = parseCommandTextFromContext(context);

  if (!commandText)
    return await context.reply('Group name Cannot be left defined. see usage from /help');

  const groupName = commandText.split(' ')[0];

  let channel = DataService.getChannelFromContext(context);

  await context.reply(`Adding Channel ${channel.title} to group ${groupName}`);

  await DataService
    .addChannelToGroup(channel, groupName)
    .saveDatabase();
}