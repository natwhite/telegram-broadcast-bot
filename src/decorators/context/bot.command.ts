import {Context} from 'grammy';
import {Command, CommandLoaderService} from '../../services/command.loader.service';

export function BotCommand<T = any>(command: Command) {
  return function(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<(ctx: Context, ...args: any) => Promise<T | undefined>>) {
    let method = descriptor.value!;

    // TODO : This could be indexed as a map, but there won't be that many commands. This will be run everytime any bot command is run though.
    const isCommandLoaded = !!CommandLoaderService.commandList.find(savedCommand => savedCommand.trigger == command.trigger);
    if (isCommandLoaded) throw new Error(`Command Generator function for ${command.trigger} has been called multiple times!`);

    command.func = method;
    CommandLoaderService.commandList.push(command);

    // We need to use an anonymous function here because an arrow function would keep the outer scope.
    descriptor.value = async function(ctx: Context, ...args: any) {
      return method.apply(this, [ctx, ...args]);
    };
  };
}
