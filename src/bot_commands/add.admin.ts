import {Context} from 'grammy';
import {MessageEntity} from 'grammy/out/platform';
import {DataService} from '../services/data.service';
import {User} from '../interface/telegram/user';

export async function AddAdmin(context: Context) {
  if (!context.message!.entities!) throw new Error('There are no mentioned users to modify');

  console.log(`Getting mentioned users`);
  const mentionedUsers = context.message!.entities!
    .filter(entity => entity.type == 'text_mention')
    .map(value => (value as MessageEntity.TextMentionMessageEntity).user)
    .map(({id, is_bot, first_name, language_code}) => ({id, is_bot, first_name, language_code} as User));

  if (mentionedUsers.length <= 0) throw new Error('Unable to extract mentioned users');

  DataService.addAdmins(mentionedUsers);
  await DataService.saveDatabase();

  let message = `Added users ${mentionedUsers.map(user => user.first_name).join(', ')} to list of global admins`;
  console.log(message);
  await context.reply(message);
}