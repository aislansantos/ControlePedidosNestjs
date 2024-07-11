import * as dotenv from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import { CustomerEntity } from "../src/customers/entities/customer.entity";
import { UserEntity } from "../src/users/entities/user.entity";
import { MainSeeder } from "../src/utils/seeds/main.seeder";

dotenv.config({
	// configuração do arquivo para enxergar os dados de teste quando for fazer os teste.
	path: process.env.ENV === "test" ? ".env.test" : ".env"
});

const port = Number(process.env.DB_PORT);

// Usando TYPEORM-EXTENSIONS para criar seeds no banco.
const options: DataSourceOptions & SeederOptions = {
	type: "mysql",
	host: process.env.DB_HOST,
	port: port,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	entities: [UserEntity, CustomerEntity],
	migrations: [`${__dirname}/migrations/**/*.ts`],
	// Precisamos somente da mainSeed que ja está fazendo a gestão das seeds.
	seeds: [MainSeeder]
};

const dataSource = new DataSource(options);
export default dataSource;
