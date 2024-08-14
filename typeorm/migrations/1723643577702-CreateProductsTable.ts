import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProductsTable1723643577702 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "products",
				columns: [
					{
						name: "id",
						type: "int",
						isPrimary: true,
						isGenerated: true,
						generationStrategy: "increment",
						unsigned: true
					},
					{
						name: "descriprion",
						type: "varchar",
						length: "127",
						isNullable: false
					},
					{
						name: "selling_price",
						type: "float",
						scale: 2,
						precision: 7,
						isNullable: false
					},
					{
						name: "product_stock",
						type: "int",
						default: 0
					},
					{
						name: "status",
						type: "int",
						default: 1
					}
				]
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		queryRunner.dropTable("products");
	}
}
