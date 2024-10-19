import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { Role } from "src/modules";
import { Messages } from "../config";

export class LoginDto {
  @ApiProperty({
    default: "A1111"
  })
  @IsNotEmpty({
    message: Messages.dto.auth.userCode
  })
  userCode: string;

  @ApiProperty({
    default: "P@ssword~sample1"
  })
  @IsNotEmpty({
    message: Messages.dto.auth.password
  })
  password: string;
}


export class RegisterDto {
  @ApiProperty({
    default: "John Doe"
  })
  @IsNotEmpty({
    message: Messages.dto.auth.fullName
  })
  fullName: string;

  @ApiProperty({
    default: "example@gmail.com"
  })
  @IsEmail({}, {
    message: Messages.dto.auth.email
  })
  email: string;

  @ApiProperty({
    default: "A99999"
  })
  @IsNotEmpty({
    message: Messages.dto.auth.userCode
  })
  userCode: string;

  @ApiProperty({
    default: "P@ssword~sample1"
  })
  @IsNotEmpty({
    message: Messages.dto.auth.phone
  })
  @IsOptional()
  phone?: string;

  @IsOptional()
  role: number;
}

export class forgotPasswordDto {
  @ApiProperty({
    default: "example@gmail.com"
  })
  @IsEmail({}, {
    message: "Email chưa đúng định dạng"
  })
  email: string;
}


export class ResetPasswordDto {
  @ApiProperty({
    default: "id user"
  })
  @IsNotEmpty({ message: Messages.dto.auth.id })
  id: number;

  @ApiProperty({
    default: "P@ssword~sample1"
  })
  @IsNotEmpty({
    message: Messages.dto.auth.password
  })
  password: string;

  @ApiProperty({
    default: "P@ssword~sample1"
  })
  @IsNotEmpty({
    message: Messages.dto.auth.password
  })
  confirmPassword: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    default: "P@ssword~sample1"
  })
  @IsNotEmpty({
    message: Messages.dto.auth.password
  })
  password: string;

  @ApiProperty({
    default: "P@ssword~sample1"
  })
  @IsNotEmpty({
    message: Messages.dto.auth.password
  })
  passwordNew: string;

  @ApiProperty({
    default: "P@ssword~sample1"
  })
  @IsNotEmpty({
    message: Messages.dto.auth.password
  })
  passwordConfirm: string;
}

export interface JwtPayload {
  id: number;
  fullName: string;
  email: string;
  role: Role;
}

export interface Payload {
  id: number;
  fullName: string;
  email: string;
  role: Role;
}

export interface JwtSign {
  access_token: string;
  refresh_token: string;
}


export class refreshTokenDto {
  @ApiProperty({
    default: "refresh token"
  })
  @IsNotEmpty({ message: Messages.dto.auth.refreshToken })
  refreshToken: string;
}