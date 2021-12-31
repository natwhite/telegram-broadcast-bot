import {Context} from 'grammy';
import {CommandLoaderService} from '../services/command.loader.service';

export async function DisplayHelp(context: Context) {
  return await context.reply(CommandLoaderService.helpText);
}