import { Status } from "@enums/active.enum";
import { Role } from "@enums/role.enum";
import { BadGatewayException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateUserDto } from "@users/dto/create-user.dto";
import { UpdateUserDto } from "@users/dto/update-user.dto";
import { UserEntity } from "@users/entities/user.entity";
import { UsersService } from "@users/users.service";
import { Repository } from "typeorm";

const userEntityList: UserEntity[] = [
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

const createUserDTO: CreateUserDto = {
	name: "Aislan Santos",
	email: "aislan.santos@gmail.com",
	birthDate: new Date("1985-11-05"),
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
			const result = await userService.findAll();

			expect(result).toBe(userEntityList);
			expect(userRepository.find).toHaveBeenCalledTimes(1);
		});

		it("should throw an exception - findAll", () => {
			jest.spyOn(userRepository, "find").mockRejectedValueOnce(new Error());

			expect(userService.findAll()).rejects.toThrow();
		});
	});

	describe("findOne", () => {
		it("should found one user", async () => {
			const result = await userService.findOne(1);
			expect(result).toBe(userEntityList[0]);
			expect(userRepository.findOne).toHaveBeenCalledTimes(1);
		});
		it("should throw an exception - findOne", () => {
			jest.spyOn(userRepository, "findOne").mockRejectedValueOnce(new Error());
			expect(userService.findOne(1)).rejects.toThrow();
		});
	});

	describe("Create", () => {
		it("should be tested method create", async () => {
			jest.spyOn(userRepository, "exists").mockResolvedValueOnce(false);

			const result = await userService.create(createUserDTO);

			expect(result).toEqual(userEntityList[0]);
			expect(userRepository.save).toHaveBeenCalledTimes(1);
		});

		it("should throw an exception - create", async () => {
			jest.spyOn(userRepository, "exists").mockResolvedValueOnce(false);
			jest.spyOn(userRepository, "save").mockRejectedValueOnce(new Error());

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
			const updateUserDto: UpdateUserDto = {
				name: "Augusto Angelo Santos",
				birthDate: new Date("2021-11-22"),
				password: "Aa123456"
			};

			const result = await userService.update(2, updateUserDto);

			expect(result).toBe(userEntityList[0]);
			expect(updateUserDto.birthDate).toBeDefined();
			expect(updateUserDto.password).toBeDefined();
		});

		it("should throw an exception", () => {
			const updateUserDto: UpdateUserDto = {
				name: "Augusto Angelo Santos",
				birthDate: new Date("2021-11-22")
			};

			jest.spyOn(userRepository, "update").mockRejectedValueOnce(new Error());

			expect(userService.update(2, updateUserDto)).rejects.toThrow();
		});
	});

	describe("Delete", () => {
		it("should be deleted one register", async () => {
			const result = await userService.remove(1);

			expect(result).toBe(true);
		});
	});

	describe("exists", () => {
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
