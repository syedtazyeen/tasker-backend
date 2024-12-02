import { TicketPriority, TicketStatus } from '@/src/common/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';

export class CreateTicketReqDto {
  @ApiProperty()
  @IsString({ message: 'title is required' })
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString({ message: 'projectId is required' })
  projectId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  assigneeIds: string[];
}

export class UpdateTicketReqDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  dueTime: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  startTime: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  completionTime: Date;
}

export class GetTicketResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: TicketStatus })
  status: TicketStatus;

  @ApiProperty({ enum: TicketPriority })
  priority: TicketPriority;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  assigneeIds: string[];

  @ApiProperty()
  projectId: string;

  /* TODO - subTickets, comments, attachments, tags, recurring */

  @ApiProperty()
  timeSpent: number;

  @ApiProperty({ type: Date })
  dueTime: Date;

  @ApiProperty({ type: Date })
  startTime: Date;

  @ApiProperty({ type: Date })
  completionTime: Date;
}
