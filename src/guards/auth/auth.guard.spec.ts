import { ExecutionContext } from "@nestjs/common/interfaces";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "../../auth/auth.service";
import { UserEntity } from "../../users/entities/user.entity";
import { UsersService } from "../../users/users.service";
import { Status } from "../../utils/enums/active.enum";
import { Role } from "../../utils/enums/role.enum";
import { AuthGuard } from "./auth.guard";

const accessToken =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwibmFtZSI6Ikp1Y2EgS2lmdXJpIiwiZW1haWwiOiJqdWNhQGdtYWlsLmNvbSIsImlhdCI6MTcxOTQ5MjcwNCwiZXhwIjoxNzE5NTc5MTA0LCJhdWQiOiJ1c2VyIiwiaXNzIjoibG9naW4iLCJzdWIiOiI1In0.PQHPAK7s6JAA8ydQniT9rcJmmfqf-qKvhAXDYgMP44A";

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

describe("AuthGuard", () => {
	let authGuard: AuthGuard;
	let authService: AuthService;
	let usersService: UsersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthGuard,
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
				},
				{
					provide: UsersService,
					useValue: {
						create: jest.fn().mockResolvedValue(userEntityList[0]),
						findAll: jest.fn().mockResolvedValue(userEntityList),
						findOne: jest.fn().mockResolvedValue(userEntityList[0]),
						update: jest.fn().mockResolvedValue(userEntityList[0]),
						remove: jest.fn().mockResolvedValue(undefined),
						exists: jest.fn().mockResolvedValue(true)
					}
				}
			]
		}).compile();

		authGuard = module.get<AuthGuard>(AuthGuard);
		authService = module.get<AuthService>(AuthService);
		usersService = module.get<UsersService>(UsersService);
	});

	it("should be defined", () => {
		expect(authGuard).toBeDefined();
		expect(authService).toBeDefined();
		expect(usersService).toBeDefined();
	});

	it("should allow access with valid token", async () => {
		const mockRequest: any = {
			headers: {
				authorization: `Bearer ${accessToken}`
			}
		};

		const mockContext: ExecutionContext = {
			switchToHttp: () => ({
				getRequest: () => mockRequest
			})
		} as ExecutionContext;

		// Mock para retornar dados válidos ao verificar o token
		jest.spyOn(authService, "checkToken").mockReturnValue(jwtPayload);
		jest.spyOn(usersService, "findOne").mockResolvedValue(userEntityList[0]);

		const result = await authGuard.canActivate(mockContext);

		expect(result).toBe(true);
		expect(mockRequest.tokenPayload).toEqual(jwtPayload);
		expect(mockRequest.user).toEqual(userEntityList[0]);
	});

	it("should handle errors thrown by userService", async () => {
		const mockRequest: any = {
			headers: {
				authorization: `Bearer ${accessToken}`
			}
		};

		const mockContext: ExecutionContext = {
			switchToHttp: () => ({
				getRequest: () => mockRequest
			})
		} as ExecutionContext;

		jest.spyOn(authService, "checkToken").mockReturnValue(jwtPayload);
		jest
			.spyOn(usersService, "findOne")
			.mockRejectedValue(new Error("User not found"));

		const result = await authGuard.canActivate(mockContext);

		expect(result).toBe(false);
		expect(mockRequest.tokenPayload).toEqual(jwtPayload);
		expect(mockRequest.user).toBeUndefined();
	});

	it("should handle null token data", async () => {
		const mockRequest: any = {
			headers: {
				authorization: `Bearer ${accessToken}`
			}
		};

		const mockContext: ExecutionContext = {
			switchToHttp: () => ({
				getRequest: () => mockRequest
			})
		} as ExecutionContext;

		// Mock para retornar null ao verificar o token
		jest.spyOn(authService, "checkToken").mockReturnValue(null);

		const result = await authGuard.canActivate(mockContext);

		expect(result).toBe(false); // Verifica que o acesso não é permitido
		expect(mockRequest.tokenPayload).toBeUndefined(); // Deve ser null, já que checkToken retornou null
		expect(mockRequest.user).toBeUndefined(); // Não deve haver usuário associado
	});
});
