import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { PermissionGuard } from "../guards";
import { Roles } from "src/types";

export const PERMISSIONS_KEY = "Permissions";

export const Permission = (...permissions: string[]) => {
    return applyDecorators(
        SetMetadata(PERMISSIONS_KEY, permissions),
        UseGuards(PermissionGuard)
    );
};

export const AdminRequired = () => Permission(Roles.ADMIN);
export const GuardOrAdminRequired = () => Permission(Roles.ADMIN, Roles.GUARD);
export const UserRequired = () => Permission(Roles.ADMIN, Roles.GUARD, Roles.USER);
