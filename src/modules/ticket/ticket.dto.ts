import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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
}
