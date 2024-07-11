import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { AuthRegisterDto } from "../src/auth/dto/auth-register.dto";
import { Role } from "../src/utils/enums/role.enum";
import dataSource from "../typeorm/data-source";

const authRegisterDto: AuthRegisterDto = {
	name: "Aislan",
	email: "aislan.santos@gmail.com",
	password: "Aa123456"
};

describe("AppController (e2e)", () => {
	let app: INestApplication;
	let accessToken: string;
	let userId: number;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile();

		app = moduleFixture.createNestApplication();
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

	it("Registrar um novo usuário", async () => {
		const response = await request(app.getHttpServer())
			.post("/auth/register")
			.send(authRegisterDto);

		expect(response.statusCode).toBe(201);
		expect(typeof response.body.accessToken).toEqual("string");
	});

	it("Tentar logar com o novo usuário", async () => {
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

	it("Pegas os dados do usuário logado", async () => {
		const response = await request(app.getHttpServer())
			.post("/auth/me")
			.set("Authorization", `bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(201);
		expect(typeof response.body.id).toEqual("number");
		expect(response.body.role).toEqual(Role.User);
	});

	// Para testar se o usuario está podendo se cadastrar somenete com USER
	it("Tentar logar usuário como administrador", async () => {
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
	it("Validar se o usuário cadastrado ainda é USER", async () => {
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
	it("Tenta consultar o cadastro de um usuário especifico, sem acesso", async () => {
		const response = await request(app.getHttpServer())
			.get("/users/:id")
			.set("Authorization", `bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(403);
		expect(response.body.error).toEqual("Forbidden");
	});

	// Muda o cadastro do usuário para administrador para testarmos a proteção da rota.
	it("Altera manualmente o usuário para adninistrador", async () => {
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

	it("Tentando ver a lista de todos os usuários, agora com acesso de ad", async () => {
		const response = await request(app.getHttpServer())
			.get("/users")
			.set("Authorization", `bearer ${accessToken}`)
			.send();

		expect(response.statusCode).toBe(200);
		expect(response.body.length).toBe(2);
	});
});
