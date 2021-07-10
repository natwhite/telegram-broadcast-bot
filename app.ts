import {Configuration} from './src/lib/config';
import {Bot, Api} from 'grammy';
import {authorizeChat, broadcastMessage, configureClient, requestAuthorization} from './src/bot.functions';

import {DataService} from './src/services/data.service';
import {User} from './src/interface/telegram/user';

(async () => {
  await Configuration.loadConfig();
  await DataService.loadDatabase();
  console.log(`Authorized admins are ${JSON.stringify(DataService.getAuthorizedAdmins())}`);

  // Create a bot object
  const bot = new Bot(Configuration.botToken);


  // Test broadcast functionality of the bot


  // DataService.addChannel(-546135161);
  // DataService.addChannel(-509572501);
  // await DataService.saveDatabase();

  console.log('Starting AGN Broadcast Bot...');

  // NOTE : Order of declaration is important for determining which function to execute when triggers overlap
  // Set up global catch to prevent bot from preemptively exiting.
  bot.catch(error => console.log(`Caught error : ${error}`));

  // TODO : Ideally, there would be a way to remove authorization from chats, so it becomes necessary to track
  // const authorizedUsers: number[] = [];
  // bot.command('auth', authorizeChat);
  bot.command('auth', authorizeChat);
  bot.command('broadcast', broadcastMessage);
  bot.command('configureClient', configureClient);

  // Listen to users pressing buttons with that specific payload
  // bot.callbackQuery('contract-positions', showContractPositions);
  // bot.callbackQuery('spot-positions', showSpotPositions);
  // bot.callbackQuery('all-positions', ctx => getAllPositions().then(res => ctx.reply(res)));
  // bot.callbackQuery('settings', adjustBotSettings);
  // bot.callbackQuery('set-timer', ctx => createTimer(bot, ctx));

  // Register listeners to handle messages
  bot.hears('test', ctx => {
    ctx.reply('No testing here.');
  });

  bot.command('test', ctx => {
    console.log(JSON.stringify(ctx, null, 4));
    const user: User = ctx.update.message!.from as User;
    console.log(user.first_name);
    console.log(ctx.update.message!.chat.id);

    console.log(ctx.message!.text);
  });

  // bot.on(':text', requestAuthorization);
  bot.on(':text', ctx => {
    // console.log(ctx);
    console.log(ctx.message);
  });


  // Start the bot (using long polling)
  await bot.start({drop_pending_updates: true});
})();
