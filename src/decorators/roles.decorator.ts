import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const Roles = (...roles: any[]): CustomDecorator => SetMetadata('roles', roles);
