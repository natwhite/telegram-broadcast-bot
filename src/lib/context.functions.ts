import {DataService} from '../services/data.service';
import {Chat} from 'grammy/out/platform';
import {User} from '../interface/telegram/user';

/**
 * Checks if the given channel is in the list of Admin Channels
 *
 * @param id The id of the chat group to check against the list of admin channels
 *
 * @return Returns true if the chat is an Admin Channel
 */
export function checkAdminChannel({id}: Chat.GroupChat) {
  return DataService.getAdminChannels().find(channel => channel.id == id);
}

/**
 * Checks if the given channel is in the list of Client Channels
 *
 * @param id The id of the chat group to check against the list of client channels
 *
 * @return Returns true if the chat is a Client Channel
 */
export function checkClientChannel({id}: Chat.GroupChat) {
  return DataService.getChannels().find(channel => channel.id == id);
}

/**
 * Checks if the given channel is in the list of tracked channels
 *
 * @param chat The chat group to check against the list of tracked channels
 *
 * @return Returns true if the chat exists in the database.
 */
export function checkChannelIsTracked(chat: Chat.GroupChat) {
  return checkClientChannel(chat) || checkAdminChannel(chat);
}

/**
 * Checks to see if a user is authorized to execute execute commands in the given chat.
 *
 * @param chat The group to check the users authorization against
 * @param user The user to check for authorization against the group
 *
 * @return Returns true if the user is a global admin or is in the list of authorized users for the chat.
 */
export function checkUserAuth(chat: Chat.GroupChat, user: User): boolean {
  const trackedChannel = checkChannelIsTracked(chat);

  return checkUserGlobalAuth(user)
    || (
      !!trackedChannel
      && !!trackedChannel.authorizedUsers.find(authorizedUsers => authorizedUsers.id == user.id)
    );
}

/**
 * Checks to see if a user is in the list of global admins
 *
 * @param user The user to check against the global admins list
 *
 * @return Returns true if the user is a global admin
 */
export function checkUserGlobalAuth(user: User): boolean {
  const isGlobalAdmin = !!DataService.getAuthorizedAdmins().find(admin => admin.id == user.id);

  console.log(isGlobalAdmin
    ? `Found authorized global admin ${user.first_name}, Authorizing Command`
    : `This command must be run by an Authorized Global Admin`,
  );

  return isGlobalAdmin;
}
