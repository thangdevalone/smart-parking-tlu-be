import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { Role } from "src/modules";
import { SystemRoles } from "src/types";

export class LoginDto {
    @ApiProperty({
        default: "example@gmail.com"
    })
    @IsEmail({}, {
        message: "INVALID_EMAIL"
    })
    email: string;

    @ApiProperty({
        default: "P@ssword~sample1"
    })
    @IsNotEmpty({
        message: "PASSWORD_REQUIRED"
    })
    password: string;
}


export class RegisterDto {
    @ApiProperty({
        default: "John Doe"
    })
    @IsNotEmpty({
        message: "FULL_NAME_REQUIRED"
    })
    fullName: string;

    @ApiProperty({
        default: "example@gmai.com"
    })
    @IsEmail({}, {
        message: "INVALID_EMAIL"
    })
    email: string;

    @ApiProperty({
        default: "P@ssword~sample1"
    })
    @IsNotEmpty({
        message: "PASSWORD_REQUIRED"
    })
    password: string;

    @ApiProperty({
        default: "P@ssword~sample1"
    })
    @IsNotEmpty({
        message: "PASSWORD_REQUIRED"
    })
    confirmPassword: string;

    @ApiProperty({
        default: "A99999"
    })
    @IsNotEmpty({
        message: "USER_CODE_REQUIRED"
    })
    userCode: string;

    @ApiProperty({
        default: 6
    })
    @IsOptional()
    role: number;

}

export class forgotPasswordDto {
    @ApiProperty({
        default: "example@gmail.com"
    })
    @IsEmail({}, {
        message: "INVALID_EMAIL"
    })
    email: string;
}


export class ResetPasswordDto {
    @ApiProperty({
        default: 'id user'
    })
    @IsNotEmpty({ message: "ID_REQUIRED" })
    id: number;

    @ApiProperty({
        default: "P@ssword~sample1"
    })
    @IsNotEmpty({
        message: "PASSWORD_REQUIRED"
    })
    password: string;

    @ApiProperty({
        default: "P@ssword~sample1"
    })
    @IsNotEmpty({
        message: "PASSWORD_REQUIRED"
    })
    confirmPassword: string;
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