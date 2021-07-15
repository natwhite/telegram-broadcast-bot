import {Bot, Context} from 'grammy';
import {BotFunctions} from '../bot.functions';

type Command = {
  trigger: string;
  func: (ctx: Context) => void;
  description?: string;
  helpText?: string;
}

const commandList: Command[] = [
  {
    trigger: 'authorizeChat',
    func: BotFunctions.authorizeChat,
  },
  {
    trigger: 'unauthorizeChat',
    func: BotFunctions.unauthorizeChat,
  },
  {
    trigger: 'broadcast',
    func: BotFunctions.broadcastMessage,
  },
  {
    trigger: 'configureTest1',
    func: BotFunctions.configureTest1,
  },
  {
    trigger: 'configureTest2',
    func: BotFunctions.configureTest2,
  },
  {
    trigger: 'authorizeUsers',
    func: BotFunctions.authorizeUsers,
  },
  {
    trigger: 'initialize',
    func: BotFunctions.initializeChat,
  },
  {
    trigger: 'show',
    func: BotFunctions.showCommand,
  },
];

export const loadCommands = (bot: Bot) => {
  commandList.forEach(command => bot.command(command.trigger, command.func));


  const helpText = commandList.reduce((commandList, command) => commandList + `\n/${command.trigger}`, '');

  bot.command('helpText', ctx => ctx.reply(helpText));
};
