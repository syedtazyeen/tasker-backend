import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EventCategory, EventStatus } from '@/src/common/enums';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  id: string;

  @Prop()
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ enum: EventStatus, default: EventStatus.CONFIRMED })
  status: EventStatus;

  @Prop({ enum: EventCategory, default: EventCategory.DEFAULT })
  category: EventCategory;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: string;

  @Prop({ type: Date })
  startAt: Date;

  @Prop({ type: Date })
  endAt: Date;

  createdAt: Date;

  updatedAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});
