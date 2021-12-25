import {Context} from 'grammy';
import {Chat, MessageEntity} from 'grammy/out/platform';
import {DataService} from '../services/data.service';
import {User} from '../interface/telegram/user';

export async function AuthorizeUsers(context: Context) {
  let chat = context.message!.chat as Chat.GroupChat;
  let channel = [...DataService.getChannels(), ...DataService.getAdminChannels()].find(channel => channel.id == chat.id);
  if (!channel) throw new Error('Unable to find channel in database.');

  if (!context.message!.entities!) throw new Error('There are no mentioned users to modify');

  console.log(`Getting mentioned users`);
  const mentionedUsers = context.message!.entities!
    .filter(entity => entity.type == 'text_mention')
    .map(value => (value as MessageEntity.TextMentionMessageEntity).user)
    .map(({id, is_bot, first_name, language_code}) => ({id, is_bot, first_name, language_code} as User));

  channel.authorizedUsers.push(...mentionedUsers);
  await DataService.saveDatabase();

  let message = `Added users ${mentionedUsers.map(user => user.first_name).join(', ')} to list of authorized users for channel ${channel.title}`;
  console.log(message);
  await context.reply(message);
}