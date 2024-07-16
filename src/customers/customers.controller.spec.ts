import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthGuard } from "../guards/auth/auth.guard";
import { RoleGuard } from "../guards/role/role.guard";
import { Status } from "../utils/enums/active.enum";
import { CustomersController } from "./customers.controller";
import { CustomersService } from "./customers.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { CustomerEntity } from "./entities/customer.entity";

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

const custometEntityList: CustomerEntity[] = [
	{
		id: 1,
		name: "Teste 1",
		email: "teste1@teste.com.br",
		telephone: "(35)99999-9999",
		status: Status.active,
		address: "Rua teste ,22",
		neighborhood: "Res. Belo Horizonte",
		city: "Varginha",
		state: "MG",
		birthDate: new Date(),
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: 2,
		name: "Teste 2",
		email: "teste2@teste.com.br",
		telephone: "(35)99999-9999",
		status: Status.inactive,
		address: "Rua teste ,22",
		neighborhood: "",
		city: "Varginha",
		state: "MG",
		birthDate: new Date(),
		createdAt: new Date(),
		updatedAt: new Date()
	}
];

const createCustomerDTO: CreateCustomerDto = {
	name: "Teste 1",
	email: "teste1@teste.com.br",
	telephone: "(35)99999-9999",
	address: "Rua teste ,22",
	neighborhood: "Res. Belo Horizonte",
	city: "Varginha",
	state: "MG",
	birthDate: new Date("1985-11-05")
};

const updateCustomerDTO: UpdateCustomerDto = {
	name: "Teste 1",
	email: "teste1@teste.com.br",
	telephone: "(35)99999-9999"
};

describe("CustomersController", () => {
	let customerController: CustomersController;
	let customerService: CustomersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CustomersController],
			providers: [
				{
					provide: CustomersService,
					useValue: {
						create: jest.fn().mockResolvedValue(custometEntityList[0]),
						findAll: jest.fn().mockResolvedValue(custometEntityList),
						findOne: jest.fn().mockResolvedValue(custometEntityList[0]),
						update: jest.fn().mockResolvedValue(custometEntityList[0]),
						remove: jest.fn()
					}
				}
			]
		})
			.overrideGuard(AuthGuard)
			.useValue(AuthGuardMock)
			.overrideGuard(RoleGuard)
			.useValue(RoleGuardMock)
			.compile();

		customerController = module.get<CustomersController>(CustomersController);
		customerService = module.get<CustomersService>(CustomersService);
	});

	it("should be defined customerController e customerService", () => {
		expect(customerController).toBeDefined();
		expect(customerService).toBeDefined();
	});

	describe("findAll", () => {
		it("should found a user list entity successfully", async () => {
			// Act
			const result = await customerController.findAll();
			// Assert
			expect(result).toEqual(custometEntityList);
			expect(typeof result).toBe("object");
			expect(customerService.findAll).toHaveBeenCalledTimes(1);
		});
		it("shold throw an exception - findAll", () => {
			// Arrange
			jest.spyOn(customerService, "findAll").mockRejectedValueOnce(new Error());
			// Assert
			expect(customerController.findAll()).rejects.toThrow();
		});
	});

	describe("findOne", () => {
		it("should found one user successfully", async () => {
			// Act
			const result = await customerService.findOne(1);
			// Assert
			expect(result).toEqual(custometEntityList[0]);
			expect(typeof result).toBe("object");
			expect(customerService.findOne).toHaveBeenCalledTimes(1);
		});
		it("shold throw an exception - findeOne", () => {
			// Arrange
			jest.spyOn(customerService, "findOne").mockRejectedValueOnce(new Error());
			// Assert
			expect(customerController.findOne(1)).rejects.toThrow();
		});
	});

	describe("create", () => {
		it("should created a new customer successfully", async () => {
			// Act
			const result = await customerService.create(createCustomerDTO);
			// Assert
			expect(result).toBe(custometEntityList[0]);
			expect(customerService.create).toHaveBeenCalledTimes(1);
			expect(customerService.create).toHaveBeenCalledWith(createCustomerDTO);
		});
		it("shold throw an exception - create", () => {
			// Arrange
			jest.spyOn(customerService, "create").mockRejectedValueOnce(new Error());
			// Assert
			expect(customerController.create(createCustomerDTO)).rejects.toThrow();
		});
	});

	describe("update", () => {
		it("shoud updated one customer successfully", async () => {
			// Act
			const result = await customerService.update(1, updateCustomerDTO);
			// Assert
			expect(result).toBe(custometEntityList[0]);
		});
		it("shold throw an exception - update", () => {
			// Arrange
			jest.spyOn(customerService, "update").mockRejectedValueOnce(new Error());
			// Assert
			expect(customerController.update(1, updateCustomerDTO)).rejects.toThrow();
		});
	});

	describe("delete", () => {
		it("should deleted a customer successfully", async () => {
			// Act
			const result = await customerService.remove(1);
			// Assert
			expect(result).toBeUndefined();
		});
		it("shold throw an exception - delete", () => {
			// Arrange
			jest.spyOn(customerService, "remove").mockRejectedValueOnce(new Error());
			// Assert
			expect(customerController.remove(1)).rejects.toThrow();
		});
	});
});
