import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

export function validateObjectId(id: string): void {
  if (!Types.ObjectId.isValid(id)) {
    throw new NotFoundException('User not found');
  }
}
