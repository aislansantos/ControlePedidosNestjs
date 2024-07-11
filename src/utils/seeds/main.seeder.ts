import { DataSource } from "typeorm";
import { runSeeder, Seeder, SeederFactoryManager } from "typeorm-extension";
import { UserSeeder } from "./user.seeder";

// classe principal das execução das seeder.
export class MainSeeder implements Seeder {
	async run(
		dataSource: DataSource,
		// Linha abaixo tem de constar no arquivo mesmo sem uso, por isso desativar o erro de não usado.
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		factoryManager: SeederFactoryManager
	): Promise<any> {
		// Aqui dentro será gerenciado a ordem de criação das seeds
		// Se houver outra seeder só repetir abaixo na sequencia.
		await runSeeder(dataSource, UserSeeder);
		// await runSeeder(dataSource, CustomerSeeder);
	}
}
