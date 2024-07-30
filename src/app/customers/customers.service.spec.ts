import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Status } from "../../utils/enums/active.enum";
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
		status: Status.active,
		address: "Rua teste ,22",
		neighborhood: "Res. Belo Horizonte",
		city: "Varginha",
		state: "MG",
		birthDate: "1985-02-05",
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
		birthDate: "1990-01-11",
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
	birthDate: "1985-11-05"
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
						findAll: jest.fn().mockResolvedValue(customerEntityList),
						create: jest.fn().mockResolvedValue(createCustomerDTO),
						save: jest.fn().mockResolvedValue(customerEntityList[0]),
						find: jest.fn().mockResolvedValue(customerEntityList),
						findOne: jest.fn().mockResolvedValue(customerEntityList[0]),
						update: jest.fn().mockResolvedValue(customerEntityList[0]),
						delete: jest.fn(),
						exists: jest.fn().mockResolvedValue(true)
					}
				}
			]
		}).compile();

		customerService = module.get<CustomersService>(CustomersService);
		customerRepository = module.get(getRepositoryToken(CustomerEntity));
	});

	describe("Defined", () => {
		it("should be defined customerService and customerRepository", () => {
			expect(customerService).toBeDefined();
			expect(customerRepository).toBeDefined();
		});
	});

	describe("findAll", () => {
		it("should found all customers", async () => {
			const result = await customerService.findAll();
			expect(result).toBe(customerEntityList);
			expect(customerRepository.find).toHaveBeenCalledTimes(1);
		});
		it("shold throw an exception - findAll", () => {
			jest.spyOn(customerRepository, "find").mockRejectedValueOnce(new Error());
			expect(customerService.findAll()).rejects.toThrow();
		});
	});

	describe("findOne", () => {
		it("should found one customer", async () => {
			const result = await customerService.findOne(1);
			expect(result).toBe(customerEntityList[0]);
			expect(customerRepository.findOne).toHaveBeenCalledTimes(1);
		});
		it("shold throw an exception - findOne", () => {
			jest.spyOn(customerService, "findOne").mockRejectedValueOnce(new Error());
			expect(customerService.findOne(1)).rejects.toThrow();
		});
	});

	describe("create", () => {
		it("should be created one customer", async () => {
			const result = await customerService.create(createCustomerDTO);
			expect(result).toBe(customerEntityList[0]);
			expect(customerRepository.save).toHaveBeenCalledTimes(1);
		});
		it("shold throw an exception - create", () => {
			jest.spyOn(customerRepository, "save").mockRejectedValueOnce(new Error());
			expect(customerService.create(createCustomerDTO)).rejects.toThrow();
		});
	});

	describe("update", () => {
		it("should be updated one customer", async () => {
			const result = await customerService.update(2, updateCustomerDTO);

			expect(result).toEqual(customerEntityList[0]);
			expect(updateCustomerDTO.telephone).toBeDefined();
			expect(updateCustomerDTO.birthDate).not.toBeDefined();
		});
		it("shold throw an exception - update", () => {
			jest
				.spyOn(customerRepository, "update")
				.mockRejectedValueOnce(new Error());
			expect(customerService.update(2, updateCustomerDTO)).rejects.toThrow();
		});
	});

	describe("delete", () => {
		it("should be removed one customer", async () => {
			const result = await customerService.remove(1);
			expect(result).toBe(true);
		});
	});

	describe("exists", () => {
		it("should be not exist customer", async () => {
			jest.spyOn(customerRepository, "exists").mockResolvedValueOnce(false);

			try {
				await customerService.exists(customerEntityList[0].id);
				fail("Expected NotFoundException to be thrown");
			} catch (error) {
				expect(error).toBeInstanceOf(NotFoundException);
				expect(error.message).toBe(
					`O cliente com o id ${customerEntityList[0].id} não existe`
				);
			}
		});
	});
});
