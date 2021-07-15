import {Context} from 'grammy';
import {User} from '../../interface/telegram/user';
import {checkUserAuth} from '../../lib/context.functions';
import {Chat} from 'grammy/out/platform';

/**
 * Method decorator for functions taking a Grammy Context as the first parameter<br>
 * Checks if the user is authorized to execute restricted commands in the given channel.
 *
 * @return Prevents the decorated function from running unless the user is authorized to execute restricted commands in the channel.
 */
export function AuthorizedCommand<T = any>() {
  return function(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<(ctx: Context, ...args: any) => Promise<T | undefined>>) {
    let method = descriptor.value!;

    // We need to use an anonymous function here to create a new scope for 'this' because an arrow function would keep the outer scope.
    descriptor.value = async function(ctx: Context, ...args: any) {
      const user: User = ctx.message!.from as User;
      const chat: Chat.GroupChat = ctx.message!.chat as Chat.GroupChat;

      const isUserAuthorized = checkUserAuth(chat, user);

      if (isUserAuthorized) {
        console.log(`Found authorized user ${user.first_name} for channel ${chat.title} - Authorizing Command`);
        return method.apply(this, [ctx, ...args]);
      }

      let errorMessage = `This command must be run by an Authorized User of channel ${chat.title}`;
      console.log(errorMessage);
      await ctx.reply(errorMessage);
      return;
    };
  };
}
