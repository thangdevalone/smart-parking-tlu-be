import { BaseEntity, DeleteResult, EntityTarget, Repository } from "typeorm";
import { IBaseService } from "./i.base.service";
import { EntityId } from "typeorm/repository/EntityId";
import { LoggerService } from "src/logger";
import { PaginationDto } from "src/types";

export class BaseService<T extends BaseEntity, R extends Repository<T>> implements IBaseService<T> {
  protected readonly repository: R;
  protected readonly logger: LoggerService;

  constructor(repository: R, logger: LoggerService) {
    this.repository = repository;
    this.logger = logger;
  }

  index(filter?: any): Promise<T[]> {
    return this.repository.find({ where: filter });
  }

  findOne(filter: any): Promise<T> {
    return this.repository.findOne({ where: filter });
  }

  findById(id: EntityId): Promise<T> {
    return this.repository.findOne(id as any);
  }

  findByIds(ids: [EntityId]): Promise<T[]> {
    return this.repository.findByIds(ids);
  }

  store(data: any): Promise<T> {
    return this.repository.save(data);
  }

  async update(id: EntityId, data: any): Promise<T> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async paginate(pagination: PaginationDto, filed?: string, excludeName?: string, excludeValue?: string): Promise<{
    paginate: T[],
    page: number,
    totalPages: number,
    totalItems: number,
    hasNext: boolean
  }> {
    const { limit = 10, page = 1, sortBy = "createdAt", sortType = "ASC", search = "" } = pagination;
    const queryBuilder = this.repository.createQueryBuilder("entity");
    if (search.length > 0 && filed) {
      queryBuilder.orWhere(`entity.${filed} LIKE :search`, { search: `%${search}%` });
    }

    if (excludeName && excludeValue) {
      queryBuilder.andWhere(`entity.${excludeName} != :excludeValue`, { excludeValue });
    }

    const [results, total] = await queryBuilder
      .addOrderBy(`entity.${sortBy}`, sortType.toUpperCase() === "ASC" ? "ASC" : "DESC")
      .offset((page - 1) * limit)
      .limit(limit)
      .getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      paginate: results,
      page: page,
      totalPages,
      hasNext: page < totalPages,
      totalItems: total
    };
  }


  async deleteMultiple(ids: number[], entity: EntityTarget<T>): Promise<DeleteResult> {
    try {
      return await this.repository.createQueryBuilder()
        .delete()
        .from(entity)
        .where("id IN (:...ids)", { ids })
        .execute();
    } catch (e) {
      throw new Error("Bản ghi đang tham chiếu tới dữ liệu khác");
    }
  }


  delete(id: EntityId): Promise<DeleteResult> {
    return this.repository.delete(id);
  }

  count(filter?: any): Promise<number> {
    return this.repository.count({ where: filter });
  }

}