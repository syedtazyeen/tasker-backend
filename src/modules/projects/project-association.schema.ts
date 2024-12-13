import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '@/src/common/enums';

export type ProjectAssociationDocument = ProjectAssociation & Document;

export class UserAssociation {
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

@Schema({ timestamps: true })
export class ProjectAssociation {
  id: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ type: [UserAssociation], required: true })
  access: UserAssociation[];

  createdAt: Date;

  updatedAt: Date;
}

export const ProjectAssociationSchema =
  SchemaFactory.createForClass(ProjectAssociation);

ProjectAssociationSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});
