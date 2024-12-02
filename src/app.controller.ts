import { Controller, All, NotFoundException } from '@nestjs/common';

@Controller()
export class AppController {
  @All('*')
  unmatched() {
    throw new NotFoundException('Route not found');
  }
}
