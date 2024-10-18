import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    type: String,
    default: 'admin'
  })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(30, { message: 'Name maximum 30 characters' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(150, { message: 'Description maximum 150 characters' })
  description?: string;
}

export class UpdateRoleDto {
  @ApiProperty({
    type: String,
    default: 'update role name'
  })
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  @MaxLength(30, { message: 'Name maximum 30 characters' })
  name?: string;

  @ApiProperty({
    type: String,
    default: 'update role Description'
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(150, { message: 'Description maximum 150 characters' })
  description?: string;
}