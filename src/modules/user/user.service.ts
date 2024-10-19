import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { BaseService } from "src/shared";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { LoggerService } from "src/logger";
import { Repository } from "typeorm";
import { UserRepository } from "./user.repository";
import { compare } from "bcrypt";
import { PaginationDto } from "src/types";
import { UpdateUserDto } from "./user.dto";

@Injectable()
export class UserService extends BaseService<User, UserRepository> {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
    protected readonly logger: LoggerService
  ) {
    super(repository, logger);
  }

  async getUsers(pagination: PaginationDto) {
    const { limit = 10, page = 1, sortBy = "id", sortType = "ASC", search = "" } = pagination;
    const queryBuilder = this.repository.createQueryBuilder("entity");
    if (search.length > 0) {
      queryBuilder.orWhere(`entity.fullName LIKE :search`, { search: `%${search}%` });
    }
    queryBuilder.select(["entity.id", "entity.fullName", "entity.email", "entity.phone", "entity.userCode", "entity.createdAt", "entity.updatedAt"]);

    const [results, total] = await queryBuilder
      .addOrderBy(`entity.${sortBy}`, sortType.toUpperCase() === "ASC" ? "ASC" : "DESC")
      .leftJoinAndSelect("entity.role", "role")
      .offset((page - 1) * limit)
      .limit(limit)
      .getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    const filteredResults = results.map(user => ({
      ...user,
      role: {
        id: user.role.id,
        name: user.role.name,
        description: user.role.description
      }
    }));

    return {
      paginate: filteredResults,
      page: page,
      totalPages,
      hasNext: page < totalPages,
      totalItems: total
    };
  }

  async updateUser(id: string, updateUser: UpdateUserDto) {
    const user = await this.repository.findOne({ where: { id: +id } });

    if (!user) throw new Error("User not found");

    Object.assign(user, updateUser);

    await this.repository.save(user);

    return {
      data: user,
      message: "User updated successfully"
    };

  }

  async findByUser(email: string, userCode: string) {
    return await this.repository.findOne({ where: { email, userCode } });
  }

  async findByEmail(email: string) {
    return await this.repository.findOne({ where: { email } });
  }

  async findById(id: number) {
    return await this.repository.createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .where("user.id = :id", { id })
      .addSelect(["role.id", "role.name"])
      .getOne();
  }

  async validateUser(userCode: string, password: string) {
    const user = await this.repository.createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .where("user.userCode = :userCode", { userCode })
      .addSelect(["role.id", "role.name"])
      .getOne();

    if (!user) return null;
    if (!user.password || user.password === "") throw new HttpException("USER_LOGIN_SSO", HttpStatus.FORBIDDEN);
    const isValidPassword = await compare(password, user.password);

    if (isValidPassword) {
      delete user.password;
      return user;
    }
    return null;
  }

}
