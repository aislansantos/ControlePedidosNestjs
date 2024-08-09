// configuiração de seed do banco de dados

import * as bcrypt from "bcrypt";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { UserEntity } from "../../app/users/entities/user.entity";

export class UserSeeder implements Seeder {
	async run(
		dataSource: DataSource,
		// Linha abaixo tem de constar no arquivo mesmo sem uso, por isso desativar o erro de não usado.
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		factoryManager: SeederFactoryManager
	): Promise<any> {
		const userRepository = dataSource.getRepository(UserEntity);

		const userData = {
			name: "admin",
			email: "aislan.santos@gmail.com",
			password: await bcrypt.hash("Aa123456", await bcrypt.genSalt()),
			role: 2,
			status: 1
		};

		// verificar se o email já existe por questão do campo ser unique.
		const userExist = await userRepository.findOneBy({ email: userData.email });

		if (!userExist) {
			const newUser = userRepository.create(userData);
			await userRepository.save(newUser);
		}
	}
}
