import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CustomersService } from "./customers.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { CustomerEntity } from "./entities/customer.entity";

const customerEntityList: CustomerEntity[] = [
	{
		id: 1,
		name: "Teste 1",
		email: "teste1@teste.com.br",
		telephone: "(35)99999-9999",
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

describe("CustomersService", () => {
	let customerService: CustomersService;
	let customerRepository: Repository<CustomerEntity>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CustomersService,
				{
					provide: getRepositoryToken(CustomerEntity),
					useValue: {
						create: jest.fn().mockResolvedValue(createCustomerDTO),
						findAll: jest.fn().mockResolvedValue(customerEntityList),
						findOne: jest.fn().mockResolvedValue(customerEntityList[0]),
						update: jest.fn().mockResolvedValue(updateCustomerDTO),
						remove: jest.fn()
					}
				}
			]
		}).compile();

		customerService = module.get<CustomersService>(CustomersService);
		customerRepository = module.get(getRepositoryToken(CustomerEntity));
	});

	it("should be defined customerService and", () => {
		expect(customerService).toBeDefined();
		expect(customerRepository).toBeDefined();
	});

	describe("findAll", () => {
		it("should find all customers", () => {
			// Arrange
			// Act
			// Assert
		});
		it("shold throw an exception - findAll", () => {
			// Arrange
			// Act
			// Assert
		});
	});

	describe("findOne", () => {
		it("should found one customer", () => {
			// Arrange
			// Act
			// Assert
		});
		it("shold throw an exception - findOne", () => {
			// Arrange
			// Act
			// Assert
		});
	});

	describe("create", () => {
		it("should be created one customer", () => {
			// Arrange
			// Act
			// Assert
		});
		it("shold throw an exception - create", () => {
			// Arrange
			// Act
			// Assert
		});
	});
	describe("update", () => {
		it("should be updated one customer", () => {
			// Arrange
			// Act
			// Assert
		});
		it("shold throw an exception - update", () => {
			// Arrange
			// Act
			// Assert
		});
	});

	describe("delete", () => {
		it("should be removed one customer", () => {
			// Arrange
			// Act
			// Assert
		});
		it("shold throw an exception - delete", () => {
			// Arrange
			// Act
			// Assert
		});
	});
});
