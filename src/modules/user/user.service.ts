import { Injectable } from "@nestjs/common";
import { BaseService } from "src/shared";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService extends BaseService<User,UserRepository>{}