import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateRoleDto {
  @ApiProperty({
    type: String,
    default: "admin"
  })
  @IsString({ message: "Tên phải là một chuỗi" })
  @MaxLength(30, { message: "Tên tối đa 30 ký tự" })
  name: string;

  @IsOptional()
  @IsString({ message: "Mô tả phải là một chuỗi" })
  @MaxLength(150, { message: "Mô tả tối đa 150 ký tự" })
  description?: string;
}

export class UpdateRoleDto {
  @ApiProperty({
    type: String,
    default: "update role name"
  })
  @IsString({ message: "Tên phải là một chuỗi" })
  @IsOptional()
  @MaxLength(30, { message: "Tên tối đa 30 ký tự" })
  name?: string;

  @ApiProperty({
    type: String,
    default: "update role Description"
  })
  @IsOptional()
  @IsString({ message: "Mô tả phải là một chuỗi" })
  @MaxLength(150, { message: "Mô tả tối đa 150 ký tự" })
  description?: string;
}