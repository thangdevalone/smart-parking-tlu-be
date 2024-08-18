import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "src/types";
import { PERMISSIONS_KEY } from "../decorators/permission.decorator";
import { Messages } from "src/config";
import { Payload } from "src/auth";
import { UserService } from "src/modules";

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private user: UserService
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<Roles[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (!requiredPermissions) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const { user }: { user: Payload } = request;

        const member = await this.user.findById(user.id);

        console.log(member)

        // if (!member || !requiredPermissions.includes(member.role.name)) throw new UnauthorizedException(Messages.common.actionNotPermitted);


        return true;
    }
}
