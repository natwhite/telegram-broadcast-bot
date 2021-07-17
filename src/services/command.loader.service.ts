import {Bot, Context} from 'grammy';

export type Command = {
  trigger: string;
  func?: (ctx: Context) => void;
  arguments?: string;
  description: string;
  helpText?: string;
}

export class CommandLoaderService {
  public static commandList: Command[] = [];

  public static loadCommands(bot: Bot) {
    // TODO : need to confirm that each command has an associated function.
    CommandLoaderService.commandList.forEach(command => {
      if (!command.func) throw new Error(`There is no function associated with the trigger ${command.trigger}!`);
      bot.command(command.trigger, command.func);
    });

    const helpText = CommandLoaderService.commandList.reduce((buildingHelpText, command) => buildingHelpText + `\n/${command.trigger} ${command.arguments || ''}: ${command.description}`, '');

    bot.command('help', ctx => ctx.reply(helpText));
  };
}