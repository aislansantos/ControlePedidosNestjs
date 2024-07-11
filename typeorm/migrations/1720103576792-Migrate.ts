import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class Migrate1720103576792 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			"customers",
			new TableColumn({
				name: "telephone",
				type: "varchar",
				length: "15"
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn("customers", "telephone");
	}
}
