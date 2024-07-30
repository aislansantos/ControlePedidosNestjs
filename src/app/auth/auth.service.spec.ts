import { MailerService } from "@nestjs-modules/mailer";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { UpdateUserDto } from "../users/dto/update-user.dto";
import { UserEntity } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { Status } from "../utils/enums/active.enum";
import { Role } from "../utils/enums/role.enum";
import { AuthService } from "./auth.service";
import { AuthRegisterDto } from "./dto/auth-register.dto";

const accessToken =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwibmFtZSI6Ikp1Y2EgS2lmdXJpIiwiZW1haWwiOiJqdWNhQGdtYWlsLmNvbSIsImlhdCI6MTcxOTQ5MjcwNCwiZXhwIjoxNzE5NTc5MTA0LCJhdWQiOiJ1c2VyIiwiaXNzIjoibG9naW4iLCJzdWIiOiI1In0.PQHPAK7s6JAA8ydQniT9rcJmmfqf-qKvhAXDYgMP44A";

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

const resetToken =
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

const updateUserDTO: UpdateUserDto = {
	name: "Aislan",
	email: "aislan.santos@gmail.com",
	password: "Aa123456",
	birthDate: new Date("1985-11-05"),
	role: Role.Admin,
	status: Status.active
};

describe("AuthService", () => {
	let authService: AuthService;
	let userService: UsersService;
	let mailerService: MailerService;
	let jwtService: JwtService;
	let userRepository: Repository<UserEntity>;

	beforeEach(async () => {
		jwtService = new JwtService({} as any);
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: getRepositoryToken(UserEntity),
					useValue: {
						exists: jest.fn().mockResolvedValue(true),
						create: jest.fn(),
						save: jest.fn().mockResolvedValue(userEntityList[0]),
						find: jest.fn().mockResolvedValue(userEntityList),
						findAll: jest.fn().mockResolvedValue(userEntityList),
						findOne: jest.fn().mockResolvedValue(userEntityList[0]),
						findOneBy: jest.fn().mockResolvedValue(userEntityList[0]),
						update: jest.fn().mockResolvedValue(userEntityList[0]),
						delete: jest.fn()
					}
				},
				{
					provide: JwtService,
					useValue: {
						sign: jest.fn().mockReturnValue(accessToken),
						verify: jest.fn().mockReturnValue(jwtPayload)
					}
				},
				{
					provide: UsersService,
					useValue: {
						show: jest.fn().mockResolvedValue(userEntityList[0]),
						create: jest.fn().mockResolvedValue(userEntityList[0]),
						findAll: jest.fn().mockResolvedValue(userEntityList),
						findOne: jest.fn().mockResolvedValue(userEntityList[0]),
						update: jest.fn().mockResolvedValue(userEntityList[0]),
						remove: jest.fn().mockResolvedValue(true),
						exists: jest.fn().mockResolvedValue(true)
					}
				},
				{
					provide: MailerService,
					useValue: {
						sendMail: jest.fn()
					}
				}
			]
		}).compile();

		authService = module.get<AuthService>(AuthService);
		userService = module.get<UsersService>(UsersService);
		mailerService = module.get<MailerService>(MailerService);
		jwtService = module.get<JwtService>(JwtService);
		userRepository = module.get(getRepositoryToken(UserEntity));

		// Mock bcrypt.hash com uma função jest.fn() que retorna uma Promise resolvida com newPassword
		(jest.spyOn(bcrypt, "hash") as jest.Mock).mockImplementation(
			(input: string) => Promise.resolve(input)
		);
	});

	it("should be defined", () => {
		expect(authService).toBeDefined();
		expect(userService).toBeDefined();
		expect(mailerService).toBeDefined();
		expect(jwtService).toBeDefined();
		expect(userRepository).toBeDefined();
	});

	describe("Token", () => {
		it("should be Create Token Method", () => {
			const result = authService.createToken(userEntityList[0]);

			expect(result).toEqual({ accessToken });
		});

		it("should be Check Token Method", () => {
			const result = authService.checkToken(accessToken);

			expect(result).toBe(jwtPayload);
		});

		it("should be isValidToken Method", () => {
			const result = authService.isValidToken(accessToken);

			expect(result).toBe(true);
		});
	});

	describe("Authentication", () => {
		it("should be Login Method", async () => {
			const result = await authService.login("juca@gmail.com", "Aa123456");

			expect(result).toEqual({ accessToken });
		});

		it("should be Forget Method", async () => {
			// Mock userService.findOne para retornar um usuário
			jest.spyOn(userService, "findOne").mockResolvedValue(userEntityList[0]);

			const result = await authService.forget("aislan.santos@gmail.com");

			expect(result).toEqual({ success: true });

			// Verifique se o método sendMail de mailerService foi chamado com os parâmetros esperados
			expect(mailerService.sendMail).toHaveBeenCalledWith(
				expect.objectContaining({
					subject: "Recuperação de senha.",
					to: "aislan.santos@gmail.com",
					template: "forget",
					context: {
						name: userEntityList[0].name,
						token: expect.any(String) // Ajuste conforme necessário
					}
				})
			);
		});

		it("should be Register Method", async () => {
			const result = await authService.register(authRegisterDto);

			expect(result.accessToken).toEqual(accessToken);
		});
	});

	describe("Exceptions", () => {
		it("should throw an invalid token error", () => {
			const invalidToken = "invalidToken";
			(jwtService.verify as jest.Mock).mockImplementationOnce(() => {
				throw new Error("Token inválido");
			});

			try {
				authService.checkToken(invalidToken);
				fail("Expected BadRequestException to be thrown");
			} catch (error) {
				expect(error).toBeInstanceOf(BadRequestException);
				expect(error.message).toBe("Token inválido");
			}
		});

		it("should throw UnauthorizedException for invalid email", async () => {
			const invalidEmail = "invalid@example.com";
			// (userServiceMock.useValue.findOne as jest.Mock).mockResolvedValue(null);
			jest.spyOn(userService, "findOne").mockRejectedValueOnce(null);

			try {
				await authService.login(invalidEmail, "invalidPassword");
				fail("Expected UnauthorizedException to be thrown");
			} catch (error) {
				expect(error).toBeInstanceOf(UnauthorizedException);
				expect(error.message).toBe("E-mail e/ou senha incorretos");
			}
		});
	});

	describe("Reset Password", () => {
		it("should throw UnauthorizedException for invalid token", async () => {
			const invalidToken = "invalidToken";
			const newPassword = "newPassword123";

			// Mock jwtService.verify para lançar um erro
			(jwtService.verify as jest.Mock).mockImplementationOnce(() => {
				throw new Error("Token inválido");
			});

			try {
				await authService.reset(newPassword, invalidToken);
				fail("Expected UnauthorizedException to be thrown");
			} catch (error) {
				expect(error).toBeInstanceOf(UnauthorizedException);
				expect(error.message).toBe("Token inválido");
			}
		});

		it("shold be valid token", async () => {
			const result = await authService.reset(
				updateUserDTO.password,
				resetToken
			);

			expect(result.accessToken).toBe(accessToken);
			expect(typeof result.accessToken).toBe("string");
		});

		describe("isValidToken", () => {
			it("should return true for a valid token", () => {
				const result = authService.isValidToken(accessToken);
				expect(result).toBe(true);
			});

			it("should return false for an invalid token", () => {
				// Mockando jwtServiceMock.verify para lançar uma BadRequestException
				(jwtService.verify as jest.Mock).mockImplementationOnce(() => {
					throw new BadRequestException("Token inválido");
				});

				const result = authService.isValidToken("invalidToken");

				expect(result).toBe(false);
			});
		});

		describe("login", () => {
			it("should throw an UnauthorizedException if email is not found", async () => {
				jest.spyOn(userRepository, "findOne").mockResolvedValueOnce(null);

				await expect(
					authService.isValidEmail("invalid@example.com")
				).rejects.toThrow(UnauthorizedException);
			});
		});
	});
});
