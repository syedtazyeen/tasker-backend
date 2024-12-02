export * from './users.types';

interface JwtPayload {
  sub: string;
  [key: string]: any;
}

export interface RequestWithUser extends Request {
  user?: JwtPayload;
}
