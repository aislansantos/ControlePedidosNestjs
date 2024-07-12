import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CustomersService } from "./customers.service";
import { CustomerEntity } from "./entities/customer.entity";

const customerEntityList: CustomerEntity[] = [
	{
		id: 0,
		name: "",
		email: "",
		telephone: "",
		address: "Rua ,",
		neighborhood: "",
		city: "",
		state: "",
		birthDate: new Date(),
		createdAt: new Date(),
		updatedAt: new Date()
	}
];

describe("CustomersService", () => {
	let service: CustomersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CustomersService,
				{
					provide: getRepositoryToken(CustomerEntity),
					useValue: {
						create: jest.fn(),
						findAll: jest.fn(),
						findOne: jest.fn(),
						update: jest.fn(),
						remove: jest.fn(),
						exists: jest.fn()
					}
				}
			]
		}).compile();

		service = module.get<CustomersService>(CustomersService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
