import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthGuard } from "../guards/auth/auth.guard";
import { UserEntity } from "../users/entities/user.entity";
import { Status } from "../utils/enums/active.enum";
import { Role } from "../utils/enums/role.enum";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthForgetDto } from "./dto/auth-forget.dto";
import { AuthLoginDto } from "./dto/auth-login.dto";
import { AuthRegisterDto } from "./dto/auth-register.dto";
import { AuthResetDto } from "./dto/auth-reset.dto";

@Injectable()
export class AuthGuardMock implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		request.user = { id: 1, username: "testuser" }; // Mock do usuário autenticado
		return true;
	}
}

const accessToken =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwibmFtZSI6Ikp1Y2EgS2lmdXJpIiwiZW1haWwiOiJqdWNhQGdtYWlsLmNvbSIsImlhdCI6MTcxOTQ5MjcwNCwiZXhwIjoxNzE5NTc5MTA0LCJhdWQiOiJ1c2VyIiwiaXNzIjoibG9naW4iLCJzdWIiOiI1In0.PQHPAK7s6JAA8ydQniT9rcJmmfqf-qKvhAXDYgMP44A";

const authForgetDto: AuthForgetDto = {
	email: "juca@gmail.com"
};

const authResetDto: AuthResetDto = {
	token: accessToken,
	password: "Aa123456"
};

const authLoginDto: AuthLoginDto = {
	email: "aislan.santos@gmail.com",
	password: "Aa123456"
};

const authRegisterDto: AuthRegisterDto = {
	name: "Aislan",
	email: "aislan.santos@gmail.com",
	password: "Aa123456"
};

const jwtPayload = {
	id: 5,
	name: "Juca Kifuri",
	email: "juca@gmail.com",
	iat: 1719342202,
	exp: 1719428602,
	aud: "user",
	iss: "login",
	sub: "5"
};

export const userEntityList: UserEntity[] = [
	{
		id: 1,
		name: "Aislan Santos",
		email: "aislan.santos@gmail.com",
		birthDate: new Date("1985-11-05"),
		password: "$2b$10$q8j4GT14ksUDtG7gx0UQSuyfULF38XFMTwFgCLsg46d4zBjNcjMKG",
		role: Role.Admin,
		createdAt: new Date(),
		updatedAt: new Date(),
		status: Status.active
	},
	{
		id: 2,
		name: "Augusto Santos",
		email: "augusto.santos@gmail.com",
		birthDate: new Date("1999-01-01"),
		password: "$2b$10$q8j4GT14ksUDtG7gx0UQSuyfULF38XFMTwFgCLsg46d4zBjNcjMKG",
		role: Role.Admin,
		createdAt: new Date(),
		updatedAt: new Date(),
		status: Status.active
	}
];

describe("AuthController", () => {
	let authController: AuthController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthService,
					useValue: {
						createToken: jest.fn().mockReturnValue({ accessToken }),
						checkToken: jest.fn().mockReturnValue(jwtPayload),
						isValidToken: jest.fn((token: string) => token === accessToken),
						login: jest.fn().mockResolvedValue({ accessToken }),
						forget: jest.fn().mockResolvedValue({ success: true }),
						reset: jest.fn().mockResolvedValue({ accessToken }),
						register: jest.fn().mockResolvedValue({ accessToken })
					}
				}
			]
		})
			.overrideGuard(AuthGuard)
			.useValue(AuthGuardMock)
			.compile();

		authController = module.get<AuthController>(AuthController);
	});

	it("should be defined", () => {
		expect(authController).toBeDefined();
	});

	describe("Authentication Flow", () => {
		it("login method", async () => {
			const result = await authController.login(authLoginDto);

			expect(result.accessToken).toBe(accessToken);
		});

		it("register method", async () => {
			const result = await authController.register(authRegisterDto);
			expect(result.accessToken).toBe(accessToken);
		});

		it("forget method", async () => {
			const result = await authController.forget(authForgetDto);
			expect(result).toEqual({ success: true });
		});

		it("reset methog", async () => {
			const result = await authController.reset(authResetDto);

			expect(result.accessToken).toBe(accessToken);
		});
	});

	describe("authenticated routes", () => {
		it("me method", async () => {
			const result = await authController.me(userEntityList[0]);
			expect(result).toBe(userEntityList[0]);
		});
	});
});
