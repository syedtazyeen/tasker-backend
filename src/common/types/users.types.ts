import { UserStatus } from '../enums';

export type JwtPayload = {
  sub: string;
  email: string;
  status: UserStatus;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  status: UserStatus;
  isVerified: boolean;
  imageUrl?: string;
  tasks: string[];
  notifications: string[];
  teams: string[];
};
