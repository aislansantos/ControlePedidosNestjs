import { BadGatewayException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Status } from "../utils/enums/active.enum";
import { Role } from "../utils/enums/role.enum";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserEntity } from "./entities/user.entity";
import { UsersService } from "./users.service";

export const userEntityList: UserEntity[] = [
	{
		id: 1,
		name: "Aislan Santos",
		email: "aislan.santos@gmail.com",
		birthAt: new Date("1985-11-05"),
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
		birthAt: new Date("1999-01-01"),
		password: "$2b$10$q8j4GT14ksUDtG7gx0UQSuyfULF38XFMTwFgCLsg46d4zBjNcjMKG",
		role: Role.Admin,
		createdAt: new Date(),
		updatedAt: new Date(),
		status: Status.active
	}
];

const createUserDTO: CreateUserDto = {
	name: "Aislan Santos",
	email: "aislan.santos@gmail.com",
	birthAt: new Date("1985-11-05"),
	password: "$2b$10$q8j4GT14ksUDtG7gx0UQSuyfULF38XFMTwFgCLsg46d4zBjNcjMKG",
	role: Role.Admin,
	status: Status.active
};

describe("UsersService", () => {
	let userService: UsersService;
	let userRepository: Repository<UserEntity>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: getRepositoryToken(UserEntity), // mocka a injeção do objeto
					useValue: {
						findAll: jest.fn().mockResolvedValue(userEntityList),
						create: jest.fn().mockReturnValue(userEntityList[0]),
						save: jest.fn().mockResolvedValue(userEntityList[0]),
						find: jest.fn().mockResolvedValue(userEntityList),
						findOne: jest.fn().mockResolvedValue(userEntityList[0]),
						findOneBy: jest.fn().mockResolvedValue(userEntityList[0]),
						update: jest.fn().mockResolvedValue(userEntityList[0]),
						delete: jest.fn(),
						exists: jest.fn().mockResolvedValue(true)
					}
				}
			]
		}).compile();

		userService = module.get<UsersService>(UsersService);
		userRepository = module.get(getRepositoryToken(UserEntity));
	});

	describe("Defined", () => {
		it("should be defined UserService and userRepository", () => {
			expect(userService).toBeDefined();
			expect(userRepository).toBeDefined();
		});
	});

	describe("findAll", () => {
		it("should found all users", async () => {
			// Act
			const result = await userService.findAll();

			// Assert
			expect(result).toBe(userEntityList);
			expect(userRepository.find).toHaveBeenCalledTimes(1);
		});

		it("should throw an exception - findAll", () => {
			// Arrange
			jest.spyOn(userRepository, "find").mockRejectedValueOnce(new Error());

			// Assert
			expect(userService.findAll()).rejects.toThrow();
		});
	});

	describe("findOne", () => {
		it("should found one user", async () => {
			// Act
			const result = await userService.findOne(1);
			// Assert
			expect(result).toBe(userEntityList[0]);
			expect(userRepository.findOne).toHaveBeenCalledTimes(1);
		});
		it("should throw an exception - findOne", () => {
			// Arrange
			jest.spyOn(userRepository, "findOne").mockRejectedValueOnce(new Error());
			// Assert
			expect(userService.findOne(1)).rejects.toThrow();
		});
	});

	describe("Create", () => {
		it("should be tested method create", async () => {
			// Act
			jest.spyOn(userRepository, "exists").mockResolvedValueOnce(false);

			// Arrange
			const result = await userService.create(createUserDTO);

			// Assert
			expect(result).toEqual(userEntityList[0]);
		});

		it("should throw an exception - create", async () => {
			// Act
			jest.spyOn(userRepository, "exists").mockResolvedValueOnce(false);
			jest.spyOn(userRepository, "save").mockRejectedValueOnce(new Error());

			// Assert
			expect(userService.create(createUserDTO)).rejects.toThrow();
		});

		it("should be return email exists", async () => {
			try {
				await userService.create(createUserDTO);
				fail("Expected BadGatewayException to be thrown");
			} catch (error) {
				expect(error).toBeInstanceOf(BadGatewayException);
				expect(error.message).toBe("Este e-mail já existe.");
			}
		});
	});

	describe("Update", () => {
		it("should be updated one data user", async () => {
			// Arrange
			const updateUserDto: UpdateUserDto = {
				name: "Augusto Angelo Santos",
				birthAt: new Date("2021-11-22"),
				password: "Aa123456"
			};

			// Act
			const result = await userService.update(2, updateUserDto);

			// Assert
			expect(result).toBe(userEntityList[0]);
			expect(updateUserDto.birthAt).toBeDefined();
			expect(updateUserDto.password).toBeDefined();
		});

		it("should throw an exception", () => {
			// Arrange
			const updateUserDto: UpdateUserDto = {
				name: "Augusto Angelo Santos",
				birthAt: new Date("2021-11-22")
			};

			jest.spyOn(userRepository, "update").mockRejectedValueOnce(new Error());

			// Assert
			expect(userService.update(2, updateUserDto)).rejects.toThrow();
		});
	});

	describe("Delete", () => {
		it("should be deleted one register", async () => {
			const result = await userService.remove(1);

			expect(result).toBe(true);
		});
	});

	describe("Exists", () => {
		it("User not exists", async () => {
			jest.spyOn(userRepository, "exists").mockResolvedValueOnce(false);

			try {
				await userService.exists(userEntityList[0].id);
				fail("Expected NotFoundException to be thrown");
			} catch (error) {
				expect(error).toBeInstanceOf(NotFoundException);
				expect(error.message).toBe(
					`O usuário com o ${userEntityList[0].id} não existe.`
				);
			}
		});
	});
});
