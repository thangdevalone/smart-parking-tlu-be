import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
export function ApiPagination() {
  return applyDecorators(
    ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number of the pagination' }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' }),
    ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Field to sort items' }),
    ApiQuery({ name: 'sortType', required: false, type: String, description: 'Sorting direction, asc or desc' }),
  );
}
