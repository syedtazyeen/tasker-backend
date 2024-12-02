import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '@/src/common/enums';

export type ProjectAssociationDocument = ProjectAssociation & Document;

@Schema({ timestamps: true })
export class ProjectAssociation {
  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(UserRole),
    required: true,
  })
  role: UserRole;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const ProjectAssociationSchema =
  SchemaFactory.createForClass(ProjectAssociation);

ProjectAssociationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
