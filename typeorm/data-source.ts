import * as dotenv from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import { BranchEntity } from "../src/app/branchs/entities/branch.entity";
import { CustomerEntity } from "../src/app/customers/entities/customer.entity";
import { ProductEntity } from "../src/app/products/entities/product.entity";
import { SellerEntity } from "../src/app/sellers/entities/seller.entity";
import { UserEntity } from "../src/app/users/entities/user.entity";
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
	entities: [
		UserEntity,
		CustomerEntity,
		BranchEntity,
		SellerEntity,
		ProductEntity
	],
	migrations: [`${__dirname}/migrations/**/*.ts`],
	// Precisamos somente da mainSeed que ja está fazendo a gestão das seeds.
	seeds: [MainSeeder]
};

const dataSource = new DataSource(options);
export default dataSource;
