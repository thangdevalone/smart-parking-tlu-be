import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationDto {

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortType?: 'ASC' | 'DESC';

}
