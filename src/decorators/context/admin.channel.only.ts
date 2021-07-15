import {Context} from 'grammy';
import {Chat} from 'grammy/out/platform';
import {checkAdminChannel} from '../../lib/context.functions';

export function AdminChannelOnly<T = any>() {
  return function(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<(ctx: Context, ...args: any) => Promise<T | undefined>>) {
    let method = descriptor.value!;

    // We need to use an anonymous function here because an arrow function would keep the outer scope.
    descriptor.value = async function(ctx: Context, ...args: any) {
      const chat: Chat.GroupChat = ctx.message!.chat as Chat.GroupChat;

      let isAdminChannel = checkAdminChannel(chat);

      if (isAdminChannel) {
        console.log(`Found Authorized Admin Channel ${chat.title}, Authorizing Command`);
        return method.apply(this, [ctx, ...args]);
      }

      let errorMessage = `This command must be run in an Authorized Admin Channel`;
      console.log(errorMessage);
      await ctx.reply(errorMessage);
    };
  };
}
