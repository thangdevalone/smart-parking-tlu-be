import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class TicketCheckinDto {
  @ApiProperty({
    type: String,
    description: "Card ID"
  })
  @IsString({ message: "Card Id required" })
  cardId: string;
}