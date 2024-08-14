import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../../utils/decorators/roles.decorator";
import { Role } from "../../utils/enums/role.enum";

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		]);

		if (!requiredRoles) {
			return true; // No roles required, allow access
		}

		console.log(context.switchToHttp().getRequest());

		const { user } = context.switchToHttp().getRequest();

		// Check if user role matches any of the required roles
		const rolesFiltred = requiredRoles.filter((role) => role === user.role);

		return rolesFiltred.length > 0;
	}
}
