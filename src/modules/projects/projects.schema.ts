import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Priority } from '@/src/common/enums';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  id: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop({ type: String, enum: Priority, default: Priority.NONE })
  priority?: string;

  createdAt: Date;

  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
