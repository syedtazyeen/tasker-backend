import { Priority } from '@/src/common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class GetNotificationResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  desciption?: string;

  @ApiProperty()
  isRead: boolean;

  @ApiProperty({ enum: Priority })
  priority: string;
}
