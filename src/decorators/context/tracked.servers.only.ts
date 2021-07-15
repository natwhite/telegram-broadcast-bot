import {Context} from 'grammy';
import {Chat} from 'grammy/out/platform';
import {checkChannelIsTracked} from '../../lib/context.functions';

export function TrackedServersOnly<T = any>() {
  return function(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<(ctx: Context, ...args: any) => Promise<T | undefined>>) {
    let method = descriptor.value!;

    // We need to use an anonymous function here because an arrow function would keep the outer scope.
    descriptor.value = async function(ctx: Context, ...args: any) {
      const chat: Chat.GroupChat = ctx.message!.chat as Chat.GroupChat;

      return checkChannelIsTracked(chat)
        ? method.apply(this, [ctx, ...args])
        : undefined;
    };
  };
}
