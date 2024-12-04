import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket, TicketDocument } from './tickets.schema';
import { CreateTicketReqDto, UpdateTicketReqDto } from './tickets.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
  ) {}

  async create(createTicketDto: CreateTicketReqDto): Promise<Ticket> {
    const createdTicket = new this.ticketModel(createTicketDto);
    return createdTicket.save();
  }

  async findAll(): Promise<Ticket[]> {
    return this.ticketModel.find().exec();
  }

  async findOne(id: string): Promise<Ticket | null> {
    return this.ticketModel.findById(id).exec();
  }

  async update(
    id: string,
    updateTicketDto: UpdateTicketReqDto,
  ): Promise<Ticket | null> {
    return this.ticketModel
      .findByIdAndUpdate(id, updateTicketDto, {
        new: true,
      })
      .exec();
  }

  async remove(id: string): Promise<Ticket | null> {
    return this.ticketModel.findByIdAndDelete(id).exec();
  }
}
