import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EventCategory, EventStatus } from '@/src/common/enums';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop()
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ enum: EventStatus, default: EventStatus.CONFIRMED })
  status: EventStatus;

  @Prop({ enum: EventCategory, default: EventCategory.DEFAULT })
  category: EventCategory;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  associatedTo: Types.ObjectId[];

  @Prop({ type: Date })
  startAt: Date;

  @Prop({ type: Date })
  endAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
