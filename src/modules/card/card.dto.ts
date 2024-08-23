import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { CardStatus } from "src/types";

export class CreateCardDto {
    @ApiProperty({ type: String, default: "card code example" })
    @IsString({ message: "INVALID_STRING" })
    cardCode: string
}

export class UpdateCardDto {
    @IsOptional()
    @IsEnum(CardStatus)
    cardStatus?: CardStatus;
}