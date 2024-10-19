import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCradTypeDto {
  @ApiProperty({
    type: String,
    default: 've thang'
  })
  @IsString({ message: 'Tên phải là một chuỗi' })
  @MaxLength(20, { message: 'Loại thẻ Tên tối đa 20 ký tự' })
  cardTypeName: string;


  @ApiProperty({
    type: Number,
    default: 3000
  })
  @IsNumber({}, { message: 'Giá phải là một số' })
  cardTypePrice: number;
}

export class UpdateCardTypeDto {
  @ApiProperty({
    type: String,
    default: 've thang'
  })
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  @MaxLength(20, { message: 'Loại thẻ Tên tối đa 20 ký tự' })
  cardTypeName: string;

  @ApiProperty({
    type: Number,
    default: 3000
  })
  @IsNumber({}, { message: 'Giá phải là một số' })
  @IsOptional()
  cardTypePrice: number;
}