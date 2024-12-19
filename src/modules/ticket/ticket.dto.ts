import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class TicketDto {
  @ApiProperty({
    type: String,
    description: 'Card ID'
  })
  @IsString({ message: 'Card Id required' })
  cardId: string;

  @ApiProperty({
    type: String,
    description: 'Image Url'
  })
  @IsString({ message: 'Image Url Id required' })
  imageUrl: string;

  @ApiProperty({
    type: Boolean,
    description: 'Indicates whether to process with AI'
  })
  @IsBoolean({ message: 'withAI must be a boolean value' })
  withAI: boolean;
}
