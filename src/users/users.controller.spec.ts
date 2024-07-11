import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthGuard } from "../guards/auth/auth.guard";
import { RoleGuard } from "../guards/role/role.guard";
import { Status } from "../utils/enums/active.enum";
import { Role } from "../utils/enums/role.enum";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserEntity } from "./entities/user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Injectable()
export class AuthGuardMock implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		request.user = { id: 1, username: "testuser" }; // Mock do usuário autenticado
		return true;
	}
}

const RoleGuardMock: CanActivate = {
	canActivate: jest.fn(() => true)
};

const userEntityList: UserEntity[] = [
	{
		id: 1,
		name: "Augusto",
		email: "augusto.angelo@gmail.com",
		password: "Aa123456",
		birthDate: new Date("2021-11-22")
	},
	{
		id: 2,
		name: "Débora",
		email: "debora.rezende@gmail.com",
		password: "Aa123456"
	},
	{
		id: 3,
		name: "Aislan",
		email: "aislan.santos@gmail.com",
		password: "Aa123456",
		role: 2
	},
	{
		id: 4,
		name: "Maria",
		email: "mae@gmail.com",
		password: "Aa123456"
	},
	{
		id: 5,
		name: "Maria",
		email: "cotinha@gmail.com",
		password: "Aa123456"
	}
];

const createUserDTO: CreateUserDto = {
	name: "Aislan",
	email: "aislan.santos@gmail.com",
	password: "Aa123456",
	birthDate: new Date("1985-11-05"),
	role: Role.Admin,
	status: Status.active
};

const updateUserDTO: UpdateUserDto = {
	name: "Aislan",
	email: "aislan.santos@gmail.com",
	password: "Aa123456"
};

describe("UsersController", () => {
	let userController: UsersController;
	let userService: UsersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [
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
		})
			.overrideGuard(AuthGuard)
			.useValue(AuthGuardMock)
			.overrideGuard(RoleGuard)
			.useValue(RoleGuardMock)
			.compile();

		userController = module.get<UsersController>(UsersController);
		userService = module.get<UsersService>(UsersService);
	});

	it("should be defined userController e userService", () => {
		expect(userController).toBeDefined();
		expect(userService).toBeDefined();
	});

	describe("findAll", () => {
		it("should return a user list entity successfully", async () => {
			// Act
			const result = await userController.findAll();

			// Assert
			expect(result).toEqual(userEntityList);
			expect(typeof result).toBe("object");
			expect(userService.findAll).toHaveBeenCalledTimes(1);
		});

		it("shoul throw an exception - findAll", () => {
			// Arrange
			jest.spyOn(userService, "findAll").mockRejectedValueOnce(new Error());

			// Assert
			expect(userController.findAll()).rejects.toThrow(Error);
		});
	});

	describe("findOne", () => {
		it("should found one user successfully", async () => {
			const result = await userController.findOne(1);

			expect(result).toBe(userEntityList[0]);
		});
	});

	describe("create", () => {
		it("should create a new user successfully", async () => {
			const result = await userController.create(createUserDTO);

			expect(result).toBe(userEntityList[0]);
			expect(userService.create).toHaveBeenCalledTimes(1);
			expect(userService.create).toHaveBeenCalledWith(createUserDTO);
		});

		it("should throw an exception - create", () => {
			// Arrange
			jest.spyOn(userService, "create").mockRejectedValueOnce(new Error());

			expect(userController.create(createUserDTO)).rejects.toThrow();
		});
	});

	describe("update", () => {
		it("should update user successfully", async () => {
			const result = await userController.update(1, updateUserDTO);

			expect(result).toBe(userEntityList[0]);
		});

		it("should throw an exception - update", () => {
			jest.spyOn(userService, "update").mockRejectedValueOnce(new Error());

			expect(userController.update(1, updateUserDTO)).rejects.toThrow();
		});
	});

	describe("delete", () => {
		it("should should delete a user successfully", async () => {
			const result = await userController.remove(1);

			expect(result).toBeUndefined();
		});

		it("should throw an excpetion - delete", () => {
			jest.spyOn(userService, "remove").mockRejectedValue(new Error());

			expect(userController.remove(1)).rejects.toThrow();
		});
	});
});
