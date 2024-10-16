import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Role } from 'src/modules';

export class LoginDto {
  @ApiProperty({
    default: 'A1111'
  })
  @IsNotEmpty({
    message: 'USER_CODE_REQUIRED'
  })
  userCode: string;

  @ApiProperty({
    default: 'P@ssword~sample1'
  })
  @IsNotEmpty({
    message: 'PASSWORD_REQUIRED'
  })
  password: string;
}


export class RegisterDto {
  @ApiProperty({
    default: 'John Doe'
  })
  @IsNotEmpty({
    message: 'FULL_NAME_REQUIRED'
  })
  fullName: string;

  @ApiProperty({
    default: 'example@gmail.com'
  })
  @IsEmail({}, {
    message: 'INVALID_EMAIL'
  })
  email: string;

  @ApiProperty({
    default: 'A99999'
  })
  @IsNotEmpty({
    message: 'USER_CODE_REQUIRED'
  })
  userCode: string;

  @ApiProperty({
    default: 'P@ssword~sample1'
  })
  @IsNotEmpty({
    message: 'PHONE_REQUIRED'
  })
  @IsOptional()
  phone?: string;

  @IsOptional()
  role: number;
}

export class forgotPasswordDto {
  @ApiProperty({
    default: 'example@gmail.com'
  })
  @IsEmail({}, {
    message: 'INVALID_EMAIL'
  })
  email: string;
}


export class ResetPasswordDto {
  @ApiProperty({
    default: 'id user'
  })
  @IsNotEmpty({ message: 'ID_REQUIRED' })
  id: number;

  @ApiProperty({
    default: 'P@ssword~sample1'
  })
  @IsNotEmpty({
    message: 'PASSWORD_REQUIRED'
  })
  password: string;

  @ApiProperty({
    default: 'P@ssword~sample1'
  })
  @IsNotEmpty({
    message: 'PASSWORD_REQUIRED'
  })
  confirmPassword: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    default: 'P@ssword~sample1'
  })
  @IsNotEmpty({
    message: 'PASSWORD_REQUIRED'
  })
  password: string;

  @ApiProperty({
    default: 'P@ssword~sample1'
  })
  @IsNotEmpty({
    message: 'PASSWORD_REQUIRED'
  })
  passwordNew: string;

  @ApiProperty({
    default: 'P@ssword~sample1'
  })
  @IsNotEmpty({
    message: 'PASSWORD_REQUIRED'
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
    default: 'refresh token'
  })
  @IsNotEmpty({ message: 'REFRESH_TOKEN_REQUIRED' })
  refreshToken: string;
}