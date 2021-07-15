// TODO : Would be preferable to not have loose typing here, but it would take too long to figure out.
import {Api, Bot, Context, InlineKeyboard} from 'grammy';
import {DataService} from './services/data.service';
import {Channel, User} from './interface/telegram';
import {AdminChannelOnly, AuthorizedCommand, GlobalAdminOnly} from './decorators/context';
import {Chat, MessageEntity} from 'grammy/out/platform';
import {checkChannelIsTracked} from './lib/context.functions';

export class BotFunctions {
  private static bot: Bot;
  private static api: Api;

  public static Configure(bot: Bot, api: Api) {
    BotFunctions.bot = bot;
    BotFunctions.api = api;
  }

  @GlobalAdminOnly()
  public static async authorizeChat(ctx: Context) {
    const channel: Channel = ctx.message!.chat as Channel;

    DataService.addAdminChannel(channel);

    await DataService.saveDatabase();
    await ctx.reply(`Added channel ${channel.title} to list of admin channels`);
  }

  @AuthorizedCommand()
  public static async unauthorizeChat(ctx: Context) {
    const channel: Channel = ctx.message!.chat as Channel;

    DataService.removeAdminChannel(channel);

    await DataService.saveDatabase();
    await ctx.reply(`Removed channel ${channel.title} from list of admin channels`);
  }

  @AdminChannelOnly()
  @AuthorizedCommand()
  public static async broadcastMessage(ctx: Context) {
    const rawInput = ctx.message?.text;

    if (!rawInput) {
      await ctx.reply(`Unable to parse message. ${rawInput}`);
      throw new Error('Broadcast rawInput cannot be undefined');
    }

    const cleanedInput = rawInput.slice(ctx.message!.entities![0].length + 1);

    // DataService.getClientChannels().forEach(channel => {
    DataService.getChannels().forEach(channel => {
      ctx.api.sendMessage(channel.id, cleanedInput);
    });
  }

  @AuthorizedCommand()
  public static async configureClient(ctx: Context) {
    await DataService.saveDatabase();
  }

  @AuthorizedCommand()
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

  @AuthorizedCommand()
  public static async authorizeUsers(ctx: Context) {
    let chat = ctx.message!.chat;
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

  @AuthorizedCommand()
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

  @AuthorizedCommand()
  public static async initializeChat(ctx: Context) {
    const chat = ctx.message!.chat as Chat.GroupChat;

    if (checkChannelIsTracked(chat)) return ctx.reply('Channel has already been initialized.');

    const channel = Channel.fromContext(ctx);

    DataService.addChannel(channel);

    await DataService.saveDatabase();

    return ctx.reply('Channel initialized successfully.');
  }

  @AdminChannelOnly()
  public static async showCommand(ctx: Context) {
    const helpText = '/show <groups|admins>\n\t\tList tracked groups or admins'
      + '\n/show groups <groupname>\n\t\tLists description and members of the given group';

    return ctx.reply(helpText);
  }

}

// function generateAccountHeader(account: PhemexAccount) {
//   return `${account.name} Positions :`;
// }

// export async function showContractPositions(ctx: any) {
//   console.log(`Show contract positions requested from channel ${ctx.chat ? ctx.chat.id : '---'} by ${ctx.chatMember}`);
//   await Promise
//     .all(Configuration.accounts.map<Promise<string>>(acc => formatActiveContractPositions(acc)))
//     .then(positions => {
//       // console.log(`Positions are ${JSON.stringify(positions)}`);
//       ctx.reply(`---- Tracking ${positions.length} Accounts ----\n\n` + positions
//         .map(pos => indent(pos, Configuration.indent))
//         .map((indentedPos, index) => [generateAccountHeader(Configuration.accounts[index]), indentedPos]
//           .join('\n'))
//         .join('\n'));
//     }).catch(err => `Error: Unable to retrieve contract positions and post results to chat - ${err}`);
// }

// export async function showSpotPositions(ctx: any) {
//   console.log(`Show spot positions requested from channel ${ctx.chat ? ctx.chat.id : '---'} by ${ctx.chatMember}`);
//   await Promise
//     .all(Configuration.accounts.map<Promise<string>>(acc => formatActiveSpotPositions(acc)))
//     .then(positions => {
//       console.log(`Positions are ${JSON.stringify(positions)}`);
//       ctx.reply(`---- Tracking ${positions.length} Accounts ----\n\n` + positions
//         .map(pos => indent(pos, Configuration.indent))
//         .map((indentedPos, index) => [generateAccountHeader(Configuration.accounts[index]), indentedPos]
//           .join('\n'))
//         .join('\n'));
//     }).catch(err => `Error: Unable to retrieve spot positions and post results to chat - ${err}`);
// }

// TODO : decide if you want to pass the ctx param to these functions
// On one hand, you can encapsulate everything cleanly in app.ts by passing it, but without typing it's not as clean
// Not to mention, having this function evaluate to a string allows it to be more modular which eases debugging.
// export async function getAllPositions() {
//   console.log('Show all positions requested ');
//   // TODO : Would be really nice to have observables here instead.
//   return await Promise
//     .all(Configuration.accounts.map<Promise<string[]>>(acc => Promise
//       .all([formatActiveContractPositions(acc), formatActiveSpotPositions(acc)])))
//     .then(positionsSets => positionsSets.map<string>(set => set.join('\n')))
//     .then(positions => `---- Tracking ${positions.length} Accounts ----\n` + positions
//       .map(pos => indent(pos, Configuration.indent))
//       .map((indentedPos, index) => [generateAccountHeader(Configuration.accounts[index]), indentedPos]
//         .join('\n'))
//       .join('\n'))
//     .catch(err => `Error: Unable to retrieve contract / Spot positions and post results to chat - ${err}`);
// }

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

// export async function createTimer(bot: Bot, ctx: any) {
//
//   const id = ctx.chat ? ctx.chat.id : 0;
//   console.log(`Timer creation requested from channel ${id} by ${ctx.chatMember}`);
//   const keyboard = new InlineKeyboard().text('Cancel Timer', `cancel-timer-${id}`);
//   ctx.reply(`Timer has been created and will update positions every '${Configuration.timerMinutes}' minute(s)`, {
//     reply_markup: keyboard,
//   });
//
//   const interval = setInterval(() => {
//     getAllPositions()
//       .then(res => ctx.reply(res, {
//         reply_markup: keyboard,
//       }))
//       .catch(err => `Error: Unable to retrieve and post results to chat - ${err}`);
//   }, Configuration.timerMinutes * 60 * 1000);
//
//   // This is created here to loosely support simultaneous timers in multiple channels.
//   bot.callbackQuery(`cancel-timer-${id}`, ctx => {
//     console.log(`Timer deletion requested from channel ${id} by ${ctx.chatMember}`);
//     clearInterval(interval);
//     ctx.reply(`Deleting timing from channel`);
//   });
// }

export async function requestAuthorization(ctx: any) {
  await ctx.reply('Please authorize the bot and use the generated keyboard to issue commands.');
}

export async function addClientToChannel(ctx: any) {

}

export async function addGlobalAdmin(ctx: any) {
  // const user: User = ctx.
}

