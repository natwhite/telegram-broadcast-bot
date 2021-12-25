import {Context} from 'grammy';
import {DataService} from '../services/data.service';

export async function ShowCommands(context: Context) {
  const helpText = '/show <groups|admins|channels>\n\t\tList tracked groups or admins'
    + '\n/show group <groupname>\n\t\tLists description and members of the given group'
    + '\n/show channel <channelname>\n\t\tShow groups this channel is a member along with authorized users in this channel';

  if (!context.message || !context.message.text)
    throw new Error('Message text undefined.');

  const splitMessage = context.message.text.trim().split(' ');

  if (splitMessage.length <= 1 || splitMessage.length >= 4)
    return await context.reply(`Incorrect number of arguments\n${helpText}`);

  const commandArgument = splitMessage[1];

  let response = '';
  switch (commandArgument) {
    case 'groups':
      response = DataService.getGroups().map(({name}) => name).join(', ');
      break;
    case 'admins':
      response = DataService.getAuthorizedAdmins().map(({first_name}) => first_name).join(', ');
      break;
    case 'channels':
      response = DataService.getChannels().map(({title}) => title).join(', ');
      break;
    case 'group':
      if (splitMessage.length !== 3)
        return await context.reply(`Incorrect number of arguments\n${helpText}`);

      const targetGroupName = splitMessage[2];
      const targetGroup = DataService.getGroupByName(targetGroupName);

      if (!targetGroup)
        return await context.reply(`Unable to find target group ${targetGroupName} in groups.`);

      response = DataService.getChannels().filter(channel => targetGroup.channelsIds.includes(channel.id)).map(channel => channel.title).join(', ');
      break;
    case 'channel':
      if (splitMessage.length !== 3)
        return await context.reply(`Incorrect number of arguments\n${helpText}`);

      const targetChannelName = splitMessage[2];
      const targetChannel = DataService.getChannelByName(targetChannelName);

      if (!targetChannel)
        return await context.reply(`Unable to find target channel ${targetChannelName} in groups.`);

      const channelAuthUsers = targetChannel.authorizedUsers.map(user => user.first_name).join(', ');
      const channelGroups = DataService.getGroups().filter(group => group.channelsIds.includes(targetChannel.id)).map(group => group.name).join(', ');
      response = `Groups : ${channelGroups}\nAuthorized users : ${channelAuthUsers}`;
      break;
  }

  return context.reply(response);
}