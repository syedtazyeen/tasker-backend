import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketReqDto, UpdateTicketReqDto } from './tickets.dto';
import { SwaggerTag } from './tickets.swagger';
import { validateObjectId } from '@/src/lib/utils/controller.utils';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @SwaggerTag.create()
  create(@Body() createticketDto: CreateTicketReqDto) {
    return this.ticketsService.create(createticketDto);
  }

  @Get()
  @SwaggerTag.findAll()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  @SwaggerTag.findone()
  findOne(@Param('id') id: string) {
    validateObjectId(id);
    return this.ticketsService.findOne(id);
  }

  @Patch(':id')
  @SwaggerTag.update()
  update(@Param('id') id: string, @Body() updateticketDto: UpdateTicketReqDto) {
    validateObjectId(id);
    return this.ticketsService.update(id, updateticketDto);
  }

  @Delete(':id')
  @SwaggerTag.delete()
  remove(@Param('id') id: string) {
    validateObjectId(id);
    return this.ticketsService.remove(id);
  }
}
