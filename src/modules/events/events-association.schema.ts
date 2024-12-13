import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type EventAssociationDocument = EventAssociation & Document;

@Schema({ timestamps: true })
export class EventAssociation {
  id: string;

  @Prop({ type: Types.ObjectId, ref: 'Event' })
  eventId: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: string;

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  organizers: string[];

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  recipients: string[];

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  projects: string[];
  
  createdAt: Date;

  updatedAt: Date;
}

export const EventAssociationSchema =
  SchemaFactory.createForClass(EventAssociation);

EventAssociationSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});
