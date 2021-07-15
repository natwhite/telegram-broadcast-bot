import {Context} from 'grammy';
import {User} from '../../interface/telegram/user';
import {checkUserGlobalAuth} from '../../lib/context.functions';

/**
 * Method decorator for functions taking a Grammy Context as the first parameter<br>
 * Checks if the user is an authorized global admin.
 *
 * @return Prevents the decorated function from running unless the user is authorized global admin.
 */
export function GlobalAdminOnly<T = any>() {
  return function(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<(ctx: Context, ...args: any) => Promise<T | undefined>>) {
    let method = descriptor.value!;

    // We need to use an anonymous function here to create a new scope for 'this' because an arrow function would keep the outer scope.
    descriptor.value = async function(ctx: Context, ...args: any) {
      const user: User = ctx.message!.from as User;

      const isUserAdmin = checkUserGlobalAuth(user);

      if (isUserAdmin) {
        console.log(`Global admin found ${user.first_name} - Authorizing Command`);
        return method.apply(this, [ctx, ...args]);
      }

      let errorMessage = `This command must be run by a global admin`;
      console.log(errorMessage);
      await ctx.reply(errorMessage);
      return;
    };
  };
}
