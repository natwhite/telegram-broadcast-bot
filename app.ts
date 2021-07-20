import {Configuration} from './src/lib/config';
import {Bot} from 'grammy';

import {DataService} from './src/services/data.service';
import {BotFunctions} from './src/bot.functions';
import {CommandLoaderService} from './src/services/command.loader.service';


(async () => {
  await Configuration.loadConfig();
  await DataService.loadDatabase();

  // Create a bot object
  const bot = new Bot(Configuration.botToken);
  BotFunctions.Configure(bot, bot.api);

  console.log('Starting AGN Broadcast Bot...');

  // Set up global catch to prevent bot from preemptively exiting.
  bot.catch(error => console.log(`Caught error : ${error}`));

  CommandLoaderService.loadCommands(bot);

  bot.on('message', ctx => {
    console.log(ctx.message);
  });

  bot.on('callback_query:data', ctx => {
    console.log(ctx);
    console.log(ctx.message);
  });

  // Start the bot (using long polling)
  await bot.start({drop_pending_updates: true});
})();
