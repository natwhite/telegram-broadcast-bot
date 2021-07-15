import {Configuration} from './src/lib/config';
import {Bot} from 'grammy';

import {DataService} from './src/services/data.service';
import {User} from './src/interface/telegram/user';
import {BotFunctions} from './src/bot.functions';
import {loadCommands} from './src/services/command.loader.service';


(async () => {
  await Configuration.loadConfig();
  await DataService.loadDatabase();
  console.log(`Authorized admins are ${JSON.stringify(DataService.getAuthorizedAdmins())}`);

  // Create a bot object
  const bot = new Bot(Configuration.botToken);
  BotFunctions.Configure(bot, bot.api);

  console.log('Starting AGN Broadcast Bot...');

  // NOTE : Order of declaration is important for determining which function to execute when triggers overlap
  // Set up global catch to prevent bot from preemptively exiting.
  bot.catch(error => console.log(`Caught error : ${error}`));

  // TODO : Ensure that message is always defined instead of assuming it will be.

  loadCommands(bot);

  // bot.command('configureClient', BotFunctions.configureClient);
  // bot.command('help', BotFunctions.displayHelp)


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
  bot.on('message', ctx => {
    // console.log(ctx);
    console.log(ctx.message);
  });

  // bot.on(':text', requestAuthorization);
  bot.on('callback_query:data', ctx => {
    console.log(ctx);
    console.log(ctx.message);
  });


  // Start the bot (using long polling)
  await bot.start({drop_pending_updates: true});
})();
