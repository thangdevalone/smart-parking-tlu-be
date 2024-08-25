import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";
export class UpdateUserDto {
    @ApiProperty({
        type: String,
        default: 'Quang Thang',
    })
    @IsString({ message: 'Name must be a string' })
    @MaxLength(30, { message: 'Name maximum 30 characters' })
    @IsOptional()
    fullName?: string;

    @ApiProperty({
        default: "0333333333"
    })
    @MaxLength(10, { message: 'phone maximum 10 characters' })
    @IsOptional()
    phone?: string;

    @ApiProperty({
        default: "example@gmail.com"
    })
    @IsEmail({}, {
        message: "INVALID_EMAIL"
    })
    @IsOptional()
    email?: string;

    @ApiProperty({
        default: "A99999"
    })
    @IsString({ message: 'userCode must be a string' })
    @MaxLength(6, { message: 'userCode maximum 6 characters' })
    @IsOptional()
    userCode?: string;
}

