import { AuthService } from "@auth/auth.service";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UsersService } from "@users/users.service";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UsersService
	) {}

	public async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const { authorization } = request.headers;

		try {
			const data = this.authService.checkToken(authorization.split(" ")[1]);

			if (data) {
				request.tokenPayload = data;

				request.user = await this.userService.findOne(data.id);

				if (data.id) {
					// Este bloco só será executado se data.id for truthy
					return true;
				}
			}

			return false; // Retorna false se não houver data ou data.id
		} catch (e) {
			return false; // Retorna false se ocorrer um erro ao verificar o token
		}
	}
}
