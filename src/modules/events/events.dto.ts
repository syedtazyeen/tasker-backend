import { EventCategory, EventStatus } from '@/src/common/enums';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class EventResponse {
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
  createdBy: string;

  @ApiProperty()
  startAt: Date;

  @ApiProperty()
  endAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class EventAssociationResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  eventId: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  organizers: string[];

  @ApiProperty()
  recipients: string[];

  @ApiProperty()
  projects: string[];
}

export class EventCreateRequest {
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
  organizers: string[];

  @ApiProperty()
  @IsArray()
  recipients: string[];

  @ApiProperty()
  @IsArray()
  projects: string[];

  @ApiProperty()
  @IsDateString()
  startAt: Date;

  @ApiProperty()
  @IsDateString()
  endAt: Date;
}

export class EventCreateResponse {
  @ApiProperty({ type: EventResponse })
  event: EventResponse;

  @ApiProperty({ type: EventAssociationResponse })
  association: EventAssociationResponse;
}

export class EventUpdateRequest {
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

export class EventAssociationUpdateRequest {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  addOrganisers?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  removeOrganisers?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  addRecipients?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  removeRecipients?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  addProjects?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  removeProjects?: string[];
}
