import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { CardStatus } from "src/types";
import { Transform } from "class-transformer";

export class CreateCardDto {
  @ApiProperty({ type: String, default: "card code example" })
  @IsString({ message: "INVALID_STRING" })
  cardCode: string;

  @ApiProperty({ type: Number })
  @IsNumber({}, { message: "INVALID_NUMBER" })
  cardType: number;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "INVALID_NUMBER" })
  userId: number;

}

export class UpdateCardDto {
  @IsOptional()
  @IsString({ message: "INVALID_STRING" })
  cardCode?: string;

  @IsOptional()
  @IsNumber({}, { message: "INVALID_NUMBER" })
  cardType?: number;

  @IsOptional()
  @IsEnum(CardStatus)
  cardStatus?: CardStatus;

  @IsOptional()
  @IsString() licensePlate?: string;
}