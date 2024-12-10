import { EventCategory, EventStatus } from '@/src/common/enums';
import { Event } from '@/src/common/types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class EventResponse implements Event {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ type: 'string', enum: EventStatus })
  status: EventStatus;

  @ApiProperty({ type: 'string', enum: EventCategory })
  category: EventCategory;

  @ApiProperty({ required: false })
  createdBy: string | null;

  @ApiProperty()
  associatedTo: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  startAt: Date;

  @ApiProperty()
  endAt: Date;
}

export class EventCreateRequest implements Partial<Event> {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: false,
    type: 'string',
    enum: EventStatus,
    default: EventStatus.CONFIRMED,
  })
  @IsOptional()
  @IsEnum(EventStatus)
  status: EventStatus;

  @ApiProperty({
    required: false,
    type: 'string',
    enum: EventCategory,
    default: EventCategory.DEFAULT,
  })
  @IsOptional()
  @IsEnum(EventCategory)
  category: EventCategory;

  @ApiProperty()
  @IsArray()
  associatedTo: string[];

  @ApiProperty()
  @IsDateString()
  startAt: Date;

  @ApiProperty()
  @IsDateString()
  endAt: Date;
}

export class EventUpdateRequest implements Partial<Event> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, type: 'string', enum: EventStatus })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @ApiProperty({ required: false, type: 'string', enum: EventCategory })
  @IsOptional()
  @IsEnum(EventCategory)
  category?: EventCategory;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startAt?: Date;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false })
  endAt?: Date;
}

export class EventUpdateAssociatedRequest {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  addUserIds?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  removeUserIds?: string[];
}
