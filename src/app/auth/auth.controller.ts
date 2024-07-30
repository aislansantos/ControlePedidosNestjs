import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../guards/auth/auth.guard";
import { UserEntity } from "../users/entities/user.entity";
import { User } from "../utils/decorators/user.decorator";
import { AuthService } from "./auth.service";
import { AuthForgetDto } from "./dto/auth-forget.dto";
import { AuthLoginDto } from "./dto/auth-login.dto";
import { AuthRegisterDto } from "./dto/auth-register.dto";
import { AuthResetDto } from "./dto/auth-reset.dto";

@ApiTags("Auths")
@ApiBearerAuth("JWT-auth")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Post("login")
	public async login(@Body() { email, password }: AuthLoginDto) {
		return this.authService.login(email, password);
	}

	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Post("register")
	public async register(@Body() body: AuthRegisterDto) {
		return this.authService.register(body);
	}

	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Post("forget")
	public async forget(@Body() { email }: AuthForgetDto) {
		return this.authService.forget(email);
	}

	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Post("reset")
	public async reset(@Body() { password, token }: AuthResetDto) {
		return this.authService.reset(password, token);
	}

	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@UseGuards(AuthGuard)
	@Post("me")
	// public async me(@User() user: UserEntity, @Req() { tokenPayload }) { - pegar os dados de payload para usar nos testes
	public async me(@User() user: UserEntity) {
		return user;
	}
}
