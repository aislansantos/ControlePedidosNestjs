// src/entities/user.entity.spec.ts

import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Status } from "../../../utils/enums/active.enum";
import { Role } from "../../../utils/enums/role.enum";
import { UserEntity } from "./user.entity";

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

describe("UserEntity", () => {
	let userRepository: Repository<UserEntity>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
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

		userRepository = module.get<Repository<UserEntity>>(
			getRepositoryToken(UserEntity)
		);
	});

	it("should be defined", () => {
		expect(userRepository).toBeDefined();
	});

	describe("Constructor", () => {
		it("should create an instance with provided properties", () => {
			const user = userEntityList[0];

			expect(user.id).toBe(user.id);
			expect(user.name).toBe(user.name);
			expect(user.email).toBe(user.email);
			expect(user.password).toBe(user.password);
			expect(user.birthDate).toEqual(user.birthDate);
			expect(user.role).toBe(user.role);
			expect(user.status).toBe(user.status);
			expect(user.createdAt).toEqual(user.createdAt);
			expect(user.updatedAt).toEqual(user.updatedAt);
		});

		it("should create an instance with default values if no user data provided", () => {
			const user = new UserEntity();

			expect(user.id).toBeUndefined();
			expect(user.name).toBeUndefined();
			expect(user.email).toBeUndefined();
			expect(user.password).toBeUndefined();
			expect(user.birthDate).toBeUndefined();
			expect(user.role).toBeUndefined();
			expect(user.status).toBeUndefined();
			expect(user.createdAt).toBeUndefined();
			expect(user.updatedAt).toBeUndefined();
		});
	});
});
