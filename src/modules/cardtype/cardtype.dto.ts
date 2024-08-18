import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateCradTypeDto {
    @ApiProperty({
        type: String,
        default: 've thang',
    })
    @IsString({ message: 'Name must be a string' })
    @MaxLength(20, { message: 'Card Type Name maximum 20 characters' })
    cardTypeName: string;


    @ApiProperty({
        type: Number,
        default: 3000,
    })
    @IsNumber({}, { message: 'Card Type Price must be a number' })
    cardTypePrice: number;
}

export class UpdateCardTypeDto {
    @ApiProperty({
        type: String,
        default: 've thang',
    })
    @IsString({ message: 'Name must be a string' })
    @IsOptional()
    @MaxLength(20, { message: 'Card Type Name maximum 20 characters' })
    cardTypeName: string;

    @ApiProperty({
        type: Number,
        default: 3000,
    })
    @IsNumber({}, { message: 'Card Type Price must be a number' })
    @IsOptional()
    cardTypePrice: number;
}