import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { PaginationDto } from 'src/types';

export const Pagination = createParamDecorator(
    async (data: unknown, ctx: ExecutionContext): Promise<PaginationDto> => {
        const request = ctx.switchToHttp().getRequest();
        const { limit, page, sortBy, sortType, search } = request.query;

        const paginationDto = plainToClass(PaginationDto, {
            limit: limit ? parseInt(limit, 10) : 10,
            page: page ? parseInt(page, 10) : 1,
            sortBy: sortBy || 'createdAt',
            sortType: sortType || 'desc',
            search: search || ''
        });

        const errors = await validate(paginationDto);
        if (errors.length > 0) {
            console.log(errors);
            throw new BadRequestException('Invalid pagination parameters');
        }

        return paginationDto;
    },
);

