import { Priority } from '@/src/common/enums';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateProjectReqDto {
  @ApiProperty()
  @IsString({ message: 'slug is required as string' })
  slug: string;

  @ApiProperty()
  @IsString({ message: 'name is required as string' })
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description: string;
}

export class GetProjectResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  creatorId: string;
}

export class GetProjectDetailResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  creatorId: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty({ enum: Priority })
  priority: Priority;
}

export class GetSlugAvailableResDto {
  @ApiProperty()
  value: boolean;
}

export class UpdateProjectReqDto extends CreateProjectReqDto {
  @ApiProperty()
  @IsOptional()
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  endDate: Date;

  @ApiProperty({ enum: Priority })
  @IsOptional()
  priority: Priority;
}
