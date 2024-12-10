import { Types } from 'mongoose';
import { RequestWithUser } from '@/src/common/types';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

export function validateObjectId(id: string): void {
  if (!Types.ObjectId.isValid(id)) {
    throw new NotFoundException('User not found');
  }
}

export function validateRequestUser(req: RequestWithUser): void {
  if (!req.user || !req.user.sub) {
    throw new UnauthorizedException();
  }
}

export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}
