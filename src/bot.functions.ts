import {Api, Bot, Context, InlineKeyboard} from 'grammy';
import {DataService} from './services/data.service';
import {Channel, User} from './interface/telegram';
import {
  AdminChannelOnly,
  AuthorizedCommand,
  GlobalAdminOnly,
  TrackedServersOnly,
  BotCommand,
} from './decorators/context';
import {Chat, MessageEntity} from 'grammy/out/platform';
import {checkChannelIsTracked, parseCommandTextFromContext} from './lib/context.functions';

export class BotFunctions {
  private static bot: Bot;
  private static api: Api;

  public static Configure(bot: Bot, api: Api) {
    BotFunctions.bot = bot;
    BotFunctions.api = api;
  }

  // NOTE : Order of declaration is important for determining which function to execute when triggers overlap

  @BotCommand({
    trigger: 'authorizeChat',
    description: 'Flag this chat as an admin channel. Must be run by a global admin',
  })
  @TrackedServersOnly()
  @GlobalAdminOnly()
  public static async authorizeChat(ctx: Context) {
    const channel = Channel.fromContext(ctx);

    await DataService
      .addAdminChannel(channel)
      .saveDatabase();

    await ctx.reply(`Added channel ${channel.title} to list of admin channels`);
  }

  @BotCommand({
    trigger: 'unauthorizeChat',
    description: 'Remove this channel from the list of admin channels. Must be run by a global admin',
  })
  @TrackedServersOnly()
  @AuthorizedCommand()
  public static async unauthorizeChat(ctx: Context) {
    const channel = Channel.fromContext(ctx);

    await DataService
      .removeAdminChannel(channel)
      .saveDatabase();

    await ctx.reply(`Removed channel ${channel.title} from list of admin channels`);
  }

  @BotCommand({
    trigger: 'broadcast',
    arguments: '<group = all>',
    description: 'Send a message to all channels in the specified group. Must be run by a global admin in an admin channel',
  })
  @AdminChannelOnly()
  @AuthorizedCommand()
  public static async broadcastMessage(context: Context) {
    const rawMessage = parseCommandTextFromContext(context);

    if (!rawMessage) throw new Error('Broadcast message cannot be undefined');

    let splitMessage = rawMessage.trim().split(' ');
    const groupName = splitMessage[0];
    const broadcastMessage = splitMessage.slice(1).join(' ');

    // DataService.getClientChannels().forEach(channel => {
    if (groupName == 'all') {
      DataService.getChannels().forEach(({id}) => {
        BotFunctions.api.sendMessage(id, broadcastMessage);
      });
      return;
    }

    let channelGroup = DataService.getChannelGroups().find(channelGroup => channelGroup.name == groupName);

    if (!channelGroup) {
      await context.reply(`Unable to find group ${groupName}. You must specify a group name or 'all'`);
      return;
    }

    channelGroup.channelsIds.forEach(id => {
      BotFunctions.api.sendMessage(id, broadcastMessage);
    });
  }

  @BotCommand({
    trigger: 'configureTest1',
    description: 'Configuration testing no 1',
  })
  public static async configureTest1(ctx: Context) {
    let chat = ctx.message!.chat;
    let channel = DataService.getChannels().find(channel => channel.id == chat.id);
    if (!channel) throw new Error('Unable to find channel in database. This is bad.');

    if (!ctx.message!.entities!) throw new Error('There are no mentioned users to modify');

    const mentionedUsers = ctx.message!.entities!
      .filter(entity => entity.type == 'text_mention')
      .map(value => (value as MessageEntity.TextMentionMessageEntity).user);

    console.log(`Found users ${mentionedUsers.map(user => user.username || user.first_name).join(', ')}`);

    // Create an inline keyboard
    // const keyboard = new InlineKeyboard().text('Positions', 'show-positions');
    let keyboard = new InlineKeyboard();
    // .text(`${Configuration.timerMinutes} min Timer 🕑`, 'set-timer')
    // Send a message with the keyboard

    let chatMembers = await BotFunctions.api.getChatAdministrators(chat.id);

    let filteredMembers = chatMembers.filter(member => !member.user.is_bot);
    console.log(`Got ${filteredMembers.length} members from group`);
    // console.log(`filtered members are ${JSON.stringify(filteredMembers)}`)

    filteredMembers.forEach(chatMember => {
      console.log(`Got member ${chatMember.user.id}`);
      keyboard.text(`${chatMember.user.username || chatMember.user.first_name}`);
    });
    keyboard.text('Done', 'done');

    if (channel.lastKeyboardMessageId) {
      console.log('Tried to create a keyboard in channel that already has one');
      return;
    }

    const message = await ctx.reply('Authorized successfully. Select an option below', {
      reply_markup: keyboard,
    });

    channel.lastKeyboardMessageId = message.message_id;
    // await DataService.saveDatabase();
  }

  @BotCommand({
    trigger: 'authorizeUsers',
    arguments: '<user1[, user2, ...]>',
    description: 'Grant the mentioned user(s) elevated privileges in this channel. Must be run by an authorized user in this channel or a global admin.',
  })
  @TrackedServersOnly()
  @AuthorizedCommand()
  public static async authorizeUsers(ctx: Context) {
    let chat = ctx.message!.chat as Chat.GroupChat;
    let channel = DataService.getChannels().find(channel => channel.id == chat.id);
    if (!channel) throw new Error('Unable to find channel in database. This is bad.');

    if (!ctx.message!.entities!) throw new Error('There are no mentioned users to modify');

    console.log(`Getting mentioned users`);
    const mentionedUsers = ctx.message!.entities!
      .filter(entity => entity.type == 'text_mention')
      .map(value => (value as MessageEntity.TextMentionMessageEntity).user)
      .map(({id, is_bot, first_name, language_code}) => ({id, is_bot, first_name, language_code} as User));

    channel.authorizedUsers.push(...mentionedUsers);
    await DataService.saveDatabase();

    let message = `Added users ${mentionedUsers.map(user => user.first_name).join(', ')} to list of authorized users for channel ${channel.title}`;
    console.log(message);
    await ctx.reply(message);
  }

  @BotCommand({
    trigger: 'configureTest2',
    description: 'Configuration testing no 1',
  })
  public static async configureTest2(ctx: Context) {
    let chat = ctx.message!.chat;
    let channel = DataService.getChannels().find(channel => channel.id == chat.id);
    if (!channel) throw new Error('Unable to find channel in database. This is bad.');

    if (!channel.lastKeyboardMessageId) {
      console.log('This command requires there to be a previous keyboard to modify');
      return;
    }

    await BotFunctions.api.editMessageText(channel.id, channel.lastKeyboardMessageId, 'werfsefsdf');

    await DataService.saveDatabase();
  }

  @BotCommand({
    trigger: 'initialize',
    description: 'Not really sure what this was meant to do again...',
  })
  @AuthorizedCommand()
  public static async initializeChat(ctx: Context) {
    const chat = ctx.message!.chat as Chat.GroupChat;

    if (checkChannelIsTracked(chat)) return ctx.reply('Channel has already been initialized.');

    const channel = Channel.fromContext(ctx);

    DataService.addChannel(channel);

    await DataService.saveDatabase();

    return ctx.reply('Channel initialized successfully.');
  }

  @BotCommand({
    trigger: 'show',
    description: 'Still in alpha, will list show information about a channel, group, or user',
  })
  @TrackedServersOnly()
  @AdminChannelOnly()
  public static async showCommand(ctx: Context) {
    const helpText = '/show <groups|admins>\n\t\tList tracked groups or admins'
      + '\n/show groups <groupname>\n\t\tLists description and members of the given group';

    return ctx.reply(helpText);
  }

  @BotCommand({
    trigger: 'addChatToGroup',
    arguments: '<groupName>',
    description: 'Add this chat to the given group',
  })
  @GlobalAdminOnly()
  public static async addChatToGroup(context: Context) {
    const commandText = parseCommandTextFromContext(context);

    if (!commandText) {
      await context.reply('Group name Cannot be left defined. see usage from /help');
      throw new Error('Channel Group cannot be undefined');
    }

    // Just going to use the first word of the command text as the group name.
    const groupName = commandText.split(' ')[0];

    const chat: Chat.GroupChat = context.message!.chat as Chat.GroupChat;
    let channel = DataService.getChannels().find(channel => channel.id == chat.id);

    if (!channel) {
      channel = Channel.fromContext(context);
      DataService.addChannel(channel);
    }

    await context.reply(`Adding Channel ${channel.title} to group ${groupName}`);

    await DataService
      .addChannelToGroup(channel, groupName)
      .saveDatabase();
  }
}

export async function adjustBotSettings(ctx: any) {
  console.log(`Settings adjustment requested`);
  // await ctx.reply('Settings are currently under development.');
  const keyboard = new InlineKeyboard()
    .text('10 mins', 'settings-time-10')
    .text('30 mins', 'settings-time-30')
    .text('1 hrs', 'settings-time-60');
  await ctx.reply('Settings Adjustment - Set timed message delay 🕑:', {
    reply_markup: keyboard,
  });
}
