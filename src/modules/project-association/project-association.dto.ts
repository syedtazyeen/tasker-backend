import { UserRole } from '@/src/common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class GetProjAsResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  projectId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  isActive: string;
}
