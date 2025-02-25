import { UserI } from 'src/users/user.interface';

export interface PostI {
  title: string;
  body: string;
  user: UserI;
}
