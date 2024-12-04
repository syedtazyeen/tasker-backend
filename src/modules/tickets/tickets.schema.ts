import { Document } from 'mongoose';
import { TicketPriority, TicketStatus } from '@/src/common/enums/tickets.enums';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TicketDocument = Ticket & Document;

@Schema({ timestamps: true })
export class Ticket {
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ enum: TicketStatus, default: TicketStatus.NOT_STARTED })
  status: string;

  @Prop({ enum: TicketPriority, default: TicketPriority.NONE })
  priority: string;

  @Prop({ required: true, type: String, ref: 'User' })
  createdBy: string;

  @Prop({ type: [String], ref: 'User' })
  assigneeIds: string[];

  @Prop({ required: true, type: String, ref: 'Project' })
  projectId: string;

  @Prop({ required: true, type: String, ref: 'Sprint' })
  sprintId: string;

  /* TODO - subTickets, comments, attachments, tags, recurring */

  @Prop()
  timeSpent: number;

  @Prop({ type: Date })
  dueTime: Date;

  @Prop({ type: Date })
  startTime: Date;

  @Prop({ type: Date })
  completionTime: Date;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

TicketSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
