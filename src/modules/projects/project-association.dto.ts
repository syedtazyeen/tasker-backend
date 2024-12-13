import { UserRole } from '@/src/common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class UserAssociationResponse {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  isActive: boolean;
}

export class ProjectAssociationResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  projectId: string;

  @ApiProperty()
  associations: UserAssociationResponse[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
