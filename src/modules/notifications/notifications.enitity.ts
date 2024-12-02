import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Priority, Resource } from '@/src/common/enums';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  resourceId?: Types.ObjectId;

  @Prop({ type: String, enum: Resource })
  resource?: Resource;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: Boolean, default: false })
  isRead: boolean;

  @Prop({ type: String, enum: Priority, default: Priority.NONE })
  priority: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
