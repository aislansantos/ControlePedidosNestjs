import { AuthRegisterDto } from "@auth/dto/auth-register.dto";
import { CreateBranchDto } from "@branchs/dto/create-branch.dto";
import { UpdateBranchDto } from "@branchs/dto/update-branch.dto";
import { CreateCustomerDto } from "@customers/dto/create-customer.dto";
import { UpdateCustomerDto } from "@customers/dto/update-customer.dto";
import { Role } from "@enums/role.enum";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import dataSource from "../typeorm/data-source";

const authRegisterDto: AuthRegisterDto = {
	name: "Aislan",
	email: "aislan.santos@gmail.com",
	password: "Aa123456"
};

const createCustomerDTO: CreateCustomerDto = {
	name: "Teste 1",
	email: "teste1@teste.com.br",
	telephone: "(35)99999-9999",
	address: "Rua teste ,22",
	neighborhood: "Res. Belo Horizonte",
	city: "Varginha",
	state: "MG",
	birthDate: "1985-02-28"
};

const updateCustomerDto: UpdateCustomerDto = {
	name: "Teste 2"
};

const createBranchDTO: CreateBranchDto = {
	description: "Filial Teste E2E",
	city: "Cidade Teste"
};

const updateBranchDto: UpdateBranchDto = {
	description: "Filial Alterado"
};

describe("App (e2e)", () => {
	let app: INestApplication;
	let accessToken: string;
	let userId: number;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile();

		app = moduleFixture.createNestApplication();

		// Em testes com class validators  temos de usar os pipes da aplicação
		app.useGlobalPipes(
			new ValidationPipe({
				transform: true,
				whitelist: true,
				forbidUnknownValues: true,
				transformOptions: {
					enableImplicitConversion: true
				}
			})
		);
		await app.init();
	});

	// Termina aplicação despois do teste executado.
	afterEach(async () => {
		await app.close();
	});

	it("/ (GET)", () => {
		return request(app.getHttpServer())
			.get("/")
			.expect(200)
			.expect("Hello World!");
	});

	it("should created a new user", async () => {
		const response = await request(app.getHttpServer())
			.post("/auth/register")
			.send(authRegisterDto);

		expect(response.statusCode).toBe(201);
		expect(typeof response.body.accessToken).toEqual("string");
	});

	it("should tried loggin whith new user", async () => {
		const response = await request(app.getHttpServer())
			.post("/auth/login")
			.send({
				email: authRegisterDto.email,
				password: authRegisterDto.password
			});

		expect(response.statusCode).toBe(201);
		expect(typeof response.body.accessToken).toEqual("string");

		accessToken = response.body.accessToken;
	});

	it("should get the logged in user's data", async () => {
		const response = await request(app.getHttpServer())
			.post("/auth/me")
			.set("Authorization", `bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(201);
		expect(typeof response.body.id).toEqual("number");
		expect(response.body.role).toEqual(Role.User);
	});

	// Para testar se o usuario está podendo se cadastrar somenete com USER
	it("should try logging in as user as administrator", async () => {
		const response = await request(app.getHttpServer())
			.post("/auth/register")
			.send({
				...authRegisterDto,
				role: Role.Admin,
				email: "teste@teste.com.br"
			});

		expect(response.statusCode).toBe(201);
		expect(typeof response.body.accessToken).toEqual("string");

		accessToken = response.body.accessToken;
	});

	// Valida se o cadastro acima foi cadastrado como UUSER como deve ocorrer
	it("should validate if the registered user is still USER", async () => {
		const response = await request(app.getHttpServer())
			.post("/auth/me")
			.set("Authorization", `bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(201);
		expect(typeof response.body.id).toEqual("number");
		expect(response.body.role).toEqual(Role.User);

		userId = response.body.id;
	});

	// Testa se a regra de não mostrar os dados de cadastro para um usuário USER está valendo.
	it("should consult the registration of a specific user, without access", async () => {
		const response = await request(app.getHttpServer())
			.get("/users/:id")
			.set("Authorization", `bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(403);
		expect(response.body.error).toEqual("Forbidden");
	});

	// Muda o cadastro do usuário para administrador para testarmos a proteção da rota.
	it("should manually change the user to administrator", async () => {
		const ds = await dataSource.initialize();

		const queryRunner = ds.createQueryRunner();

		// Trocamos o role do usuário para administrador
		await queryRunner.query(`
			UPDATE users SET role = ${Role.Admin} WHERE id = ${userId}
		`);

		// Consultamos se foi efetiva a troca de ROLE do usuário no banco de dados
		const rows = await queryRunner.query(`
			SELECT * FROM users WHERE id = ${userId}
		`);

		dataSource.destroy();

		expect(rows.length).toBe(1);
		expect(rows[0].role).toBe(Role.Admin);
	});

	it("should try to see the list of all users, now with administrator access", async () => {
		const response = await request(app.getHttpServer())
			.get("/users")
			.set("Authorization", `bearer ${accessToken}`)
			.send();
		expect(response.statusCode).toBe(200);
		expect(response.body.length).toBe(2);
	});

	describe(">Customer<", () => {
		describe("Create", () => {
			it("should created a new customer", async () => {
				const response = await request(app.getHttpServer())
					.post("/customers")
					.set("Authorization", `bearer ${accessToken}`)
					.send(createCustomerDTO);

				expect(response.statusCode).toBe(201);
			});
			it("should not success - create", async () => {
				createCustomerDTO.birthDate = "1985-02-31";

				const response = await request(app.getHttpServer())
					.post("/customers")
					.set("Authorization", `bearer ${accessToken}`)
					.send(createCustomerDTO);

				expect(response.statusCode).toBe(400);
				expect(response.badRequest).toBe(true);
			});
		});
		describe("Read", () => {
			it("should found all customers", async () => {
				const response = await request(app.getHttpServer())
					.get("/customers")
					.set("Authorization", `bearer ${accessToken}`);

				expect(response.statusCode).toBe(200);
				expect(response.body.length).toBe(1);
			});
			it("should found one customer", async () => {
				const response = await request(app.getHttpServer())
					.get("/customers/1")
					.set("Authorization", `bearer ${accessToken}`);

				expect(response.statusCode).toBe(200);
			});
			it("should not found one customer", async () => {
				const response = await request(app.getHttpServer())
					.get("/customers/2")
					.set("Authorization", `bearer ${accessToken}`);

				expect(response.statusCode).toBe(404);
				expect(response.clientError).toBe(true);
			});
		});
		describe("Update", () => {
			it("should updated one register customer", async () => {
				const response = await request(app.getHttpServer())
					.patch("/customers/1")
					.set("Authorization", `bearer ${accessToken}`)
					.send(updateCustomerDto);

				expect(response.statusCode).toBe(200);
			});
			it("should not updated one register customer", async () => {
				const response = await request(app.getHttpServer())
					.patch("/customers/5")
					.set("Authorization", `bearer ${accessToken}`)
					.send(updateCustomerDto);

				expect(response.statusCode).toBe(404);
				expect(response.clientError).toBe(true);
			});
		});
		describe("Delete", () => {
			it("should deleted one user", async () => {
				const response = await request(app.getHttpServer())
					.delete("/customers/1")
					.set("Authorization", `bearer ${accessToken}`);

				expect(response.statusCode).toBe(200);
			});
			it("should not deleted one user", async () => {
				const response = await request(app.getHttpServer())
					.delete("/customers/5")
					.set("Authorization", `bearer ${accessToken}`);

				expect(response.statusCode).toBe(404);
			});
		});
	});

	describe(">Branch<", () => {
		describe("Create", () => {
			it("should created a new branch", async () => {
				const response = await request(app.getHttpServer())
					.post("/branchs")
					.set("Authorization", `bearer ${accessToken}`)
					.send(createBranchDTO);
				expect(response.statusCode).toBe(201);
			});
			it("should not successfully - create", async () => {
				// Arange
				createBranchDTO.city = null;
				const response = await request(app.getHttpServer())
					.post("/branchs")
					.set("Authorization", `bearer ${accessToken}`)
					.send(createBranchDTO);
				expect(response.statusCode).toBe(400);
				expect(response.badRequest).toBe(true);
			});
		});
		describe("Read", () => {
			it("should found all branchs", async () => {
				const response = await request(app.getHttpServer())
					.get("/branchs")
					.set("Authorization", `bearer ${accessToken}`);
				expect(response.statusCode).toBe(200);
				expect(response.body.length).toBe(1);
			});
			it("should found one branch", async () => {
				const response = await request(app.getHttpServer())
					.get("/branchs/1")
					.set("Authorization", `bearer ${accessToken}`);

				expect(response.statusCode).toBe(200);
			});
			it("should not found all customers - findOne", async () => {
				const response = await request(app.getHttpServer())
					.get("/branchs/2")
					.set("Authorization", `bearer ${accessToken}`);
				expect(response.statusCode).toBe(404);
				expect(response.clientError).toBe(true);
			});
		});
		describe("Update", () => {
			it("should updated one register branch", async () => {
				const response = await request(app.getHttpServer())
					.patch("/branchs/1")
					.set("Authorization", `bearer ${accessToken}`)
					.send(updateBranchDto);
				expect(response.statusCode).toBe(200);
			});
			it("should not updated branch - ", async () => {
				const response = await request(app.getHttpServer())
					.patch("/branchs/5")
					.set("Authorization", `bearer ${accessToken}`)
					.send(updateBranchDto);
				expect(response.statusCode).toBe(404);
				expect(response.clientError).toBe(true);
			});
		});
		describe("Delete", () => {
			it("should deleted one branch", async () => {
				const response = await request(app.getHttpServer())
					.delete("/branchs/1")
					.set("Authorization", `bearer ${accessToken}`);
				expect(response.status).toBe(200);
			});
			it("should not deleted branch - delete ", async () => {
				const response = await request(app.getHttpServer())
					.delete("/branchs/5")
					.set("Authorization", `bearer ${accessToken}`);
				expect(response.status).toBe(404);
			});
		});
	});
});
