// TODO : Would be preferable to not have loose typing here, but it would take too long to figure out.
import {Bot, Context, InlineKeyboard} from 'grammy';
import {Configuration} from './lib/config';
// import {Configuration, PhemexAccount} from './lib/config';
// import {formatActiveContractPositions, formatActiveSpotPositions} from './message.formats';
import {checkAuth, indent} from './lib/functions';
import {User} from './interface/telegram/user';
import {DataService} from './services/data.service';
import {Channel} from './interface/telegram/channel';

export async function authorizeChat(ctx: Context) {
  const user: User = ctx.message!.from as User;
  if (!checkAuth(user)) return;

  const channel: Channel = ctx.message!.chat as Channel;

  DataService.addAdminChannel(channel);

  await DataService.saveDatabase();
  await ctx.reply(`Added channel ${channel.title} to list of admin channels`);

  // const args = ctx.match;
  // const key = ' password1:)';
  //
  // if (!args || args != key)
  //   return ctx.reply(`Invalid auth key '${args}', this channel will not be used`);
  //
  // // TODO : Would be nice if we could delete the auth key from chat somehow.
  //
  // // Create an inline keyboard
  // // const keyboard = new InlineKeyboard().text('Positions', 'show-positions');
  // const keyboard = new InlineKeyboard()
  //   .text('Contract Positions', 'contract-positions')
  //   .text('← Both →', 'all-positions')
  //   .text('Spot Positions', 'spot-positions')
  //   .row()
  //   .text('settings ⛭', 'settings');
  // // .text(`${Configuration.timerMinutes} min Timer 🕑`, 'set-timer')
  // // Send a message with the keyboard
  // await ctx.reply('Authorized successfully. Select an option below', {
  //   reply_markup: keyboard,
  // });
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

export async function broadcastMessage(ctx: any) {
  const message = 'yolo';
  DataService.getClientChannels().forEach(channel => {
    ctx.api.sendMessage(channel.id, message);
  });
}

export async function addClientToChannel(ctx: any) {

}

export async function addGlobalAdmin(ctx: any) {
  // const user: User = ctx.
}


export async function configureClient(ctx: any) {

  await DataService.saveDatabase();
}
