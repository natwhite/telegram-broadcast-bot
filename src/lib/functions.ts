import {User} from '../interface/telegram/user';
import {DataService} from '../services/data.service';

export function zip<T, G>(a: T[], b: G[]) {
  return a.map((e, k) => [e, b[k]]);
}

export function indent(text: string, num: number) {
  let spacing = ' '.repeat(num);
  return spacing + text.replace(/\n/g, '\n' + spacing);
}

export function checkAuth(user: User) {
  let isAuthorized = DataService.getAuthorizedAdmins().find(admin => admin.id == user.id);

  console.log(isAuthorized
    ? `Found Authorized Admin ${user.first_name}, Authorizing Command`
    : `This command must be run by an Authorized Admin`,
  );

  return isAuthorized;
}
