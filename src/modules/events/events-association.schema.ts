import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type EventAssociationDocument = EventAssociation & Document;

@Schema({ timestamps: true })
export class EventAssociation {
  @Prop({ type: Types.ObjectId, ref: 'Event' })
  eventId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  organisers: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  recepients: Types.ObjectId[];

  @Prop({ required: false, type: Types.ObjectId, ref: 'Project' })
  projects: Types.ObjectId[];
}

export const EventAssociationSchema =
  SchemaFactory.createForClass(EventAssociation);

EventAssociationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
