import {AdminChannelOnly} from './context/admin.channel.only';
import {ClientChannelOnly} from './context/client.channel.only';
import {AuthorizedCommand} from './context/authorized.command';
import {TrackedServersOnly} from './context/tracked.servers.only';
import {GlobalAdminOnly} from './context/global.admins.only';
import {BotCommand} from './context/bot.command';

// TODO : Ideally, there would be a decorator factory to do the heavy lifting of making these decorators.

export {
  AuthorizedCommand,
  GlobalAdminOnly,
  TrackedServersOnly,
  ClientChannelOnly,
  AdminChannelOnly,
  BotCommand,
};
