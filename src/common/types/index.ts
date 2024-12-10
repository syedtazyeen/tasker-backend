import { JwtPayload } from './users.types';

export * from './users.types';
export * from './events.types'
export interface RequestWithUser extends Request {
  user?: JwtPayload;
}
