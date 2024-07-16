import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { CreateCustomerDto } from "../src/customers/dto/create-customer.dto";

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

describe("customer (e2e)", () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterEach(async () => {
		await app.close();
	});

	it("/ (GET)", () => {
		return request(app.getHttpServer())
			.get("/")
			.expect(200)
			.expect("Hello World!");
	});

	it("should created a new customer", async () => {
		const response = await request(app.getHttpServer())
			.post("/customers")
			.send(createCustomerDTO);

		expect(response.statusCode).toBe(201);
	});

	it("", async () => {});
	it("", async () => {});
	it("", async () => {});
	it("", async () => {});
	it("", async () => {});
	it("", async () => {});
});
