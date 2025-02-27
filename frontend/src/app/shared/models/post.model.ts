import { User } from './user.model';

export interface Post {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}