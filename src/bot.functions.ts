import {Api, Bot, Context} from 'grammy';
import {
  AdminChannelOnly,
  AuthorizedCommand,
  GlobalAdminOnly,
  TrackedServersOnly,
  BotCommand,
} from './decorators/context';
import {
  AddChatToGroup,
  AuthorizeChat,
  AuthorizeUsers,
  BroadcastMessage,
  InitializeChat, ShowCommands,
  UnauthorizeChat,
} from './bot_commands';

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
    hiddenCommand: true,
  })
  @TrackedServersOnly()
  @GlobalAdminOnly()
  public static async authorizeChat(context: Context) {
    return await AuthorizeChat(context);
  }

  @BotCommand({
    trigger: 'unauthorizeChat',
    description: 'Remove this channel from the list of admin channels. Must be run by a global admin',
    hiddenCommand: true,
  })
  @TrackedServersOnly()
  @GlobalAdminOnly()
  public static async unauthorizeChat(context: Context) {
    return await UnauthorizeChat(context);
  }

  @BotCommand({
    trigger: 'broadcast',
    arguments: '<group = all>',
    description: 'Send a message to all channels in the specified group. Must be run by a global admin in an admin channel',
  })
  @AdminChannelOnly()
  @AuthorizedCommand()
  public static async broadcastMessage(context: Context) {
    return await BroadcastMessage(context, this.api);
  }

  @BotCommand({
    trigger: 'authorizeUsers',
    arguments: '<user1[, user2, ...]>',
    description: 'Grant the mentioned user(s) elevated privileges in this channel. Must be run by an authorized user in this channel or a global admin.',
  })
  @TrackedServersOnly()
  @AuthorizedCommand()
  public static async authorizeUsers(context: Context) {
    return await AuthorizeUsers(context);
  }

  @BotCommand({
    trigger: 'initialize',
    description: 'Add this chat to the bots list of tracked channels.',
  })
  @GlobalAdminOnly()
  public static async initializeChat(context: Context) {
    return await InitializeChat(context);
  }

  @BotCommand({
    trigger: 'show',
    description: 'Show information about a channel, group, or user',
  })
  @TrackedServersOnly()
  @AdminChannelOnly()
  @AuthorizedCommand()
  public static async showCommand(context: Context) {
    return await ShowCommands(context);
  }

  @BotCommand({
    trigger: 'addChatToGroup',
    arguments: '<groupName>',
    description: 'Add this chat to the given group',
  })
  @TrackedServersOnly()
  @GlobalAdminOnly()
  public static async addChatToGroup(context: Context) {
    return await AddChatToGroup(context);
  }
}

// export async function adjustBotSettings(ctx: any) {
//   console.log(`Settings adjustment requested`);
//   // await ctx.reply('Settings are currently under development.');
//   const keyboard = new InlineKeyboard()
//     .text('10 mins', 'settings-time-10')
//     .text('30 mins', 'settings-time-30')
//     .text('1 hrs', 'settings-time-60');
//   await ctx.reply('Settings Adjustment - Set timed message delay 🕑:', {
//     reply_markup: keyboard,
//   });


// @BotCommand({
//   trigger: 'configureTest2',
//   description: 'Configuration testing no 1',
// })
// public static async configureTest2(ctx: Context) {
//   let chat = ctx.message!.chat;
//   let channel = DataService.getChannels().find(channel => channel.id == chat.id);
//   if (!channel) throw new Error('Unable to find channel in database. This is bad.');
//
//   if (!channel.lastKeyboardMessageId) {
//     console.log('This command requires there to be a previous keyboard to modify');
//     return;
//   }
//
//   await BotFunctions.api.editMessageText(channel.id, channel.lastKeyboardMessageId, 'werfsefsdf');
//
//   await DataService.saveDatabase();
// }

// @BotCommand({
//   trigger: 'configureTest1',
//   description: 'Configuration testing no 1',
// })
// public static async configureTest1(ctx: Context) {
//   console.log("This is running");
//   let chat = ctx.message!.chat;
//   let channel = DataService.getChannels().find(channel => channel.id == chat.id);
//   if (!channel) throw new Error('Unable to find channel in database. This is bad.');
//
//   console.log("This is running");
//   if (!ctx.message!.entities!) throw new Error('There are no mentioned users to modify');
//
//   const mentionedUsers = ctx.message!.entities!
//     .filter(entity => entity.type == 'text_mention')
//     .map(value => (value as MessageEntity.TextMentionMessageEntity).user);
//
//   console.log(`Found users ${mentionedUsers.map(user => user.username || user.first_name).join(', ')}`);
//
//   // Create an inline keyboard
//   // const keyboard = new InlineKeyboard().text('Positions', 'show-positions');
//   let keyboard = new InlineKeyboard();
//   // .text(`${Configuration.timerMinutes} min Timer 🕑`, 'set-timer')
//   // Send a message with the keyboard
//
//   let chatMembers = await BotFunctions.api.getChatAdministrators(chat.id);
//
//   let filteredMembers = chatMembers.filter(member => !member.user.is_bot);
//   console.log(`Got ${filteredMembers.length} members from group`);
//   // console.log(`filtered members are ${JSON.stringify(filteredMembers)}`)
//
//   filteredMembers.forEach(chatMember => {
//     console.log(`Got member ${chatMember.user.id}`);
//     keyboard.text(`${chatMember.user.username || chatMember.user.first_name}`);
//   });
//   keyboard.text('Done', 'done');
//
//   if (channel.lastKeyboardMessageId) {
//     console.log('Tried to create a keyboard in channel that already has one');
//     return;
//   }
//
//   const message = await ctx.reply('Authorized successfully. Select an option below', {
//     reply_markup: keyboard,
//   });
//
//   channel.lastKeyboardMessageId = message.message_id;
//   // await DataService.saveDatabase();
// }
// }
