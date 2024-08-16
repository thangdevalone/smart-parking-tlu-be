import { SetMetadata, CustomDecorator } from '@nestjs/common';
import {  } from "src/types";
export const Roles = (...roles: any[]): CustomDecorator => SetMetadata('roles', roles);
