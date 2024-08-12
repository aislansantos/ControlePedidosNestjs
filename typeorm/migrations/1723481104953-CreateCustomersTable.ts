import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCustomersTable1723481104953 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "customers",
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
						name: "name",
						type: "string",
						length: "127",
						isNullable: false
					},
					{
						name: "email",
						type: "string",
						length: "127",
						isNullable: false
					},
					{
						name: "telephone",
						type: "string",
						length: "15",
						isNullable: false
					},
					{
						name: "status",
						type: "int",
						default: "1"
					},
					{
						name: "address",
						type: "string",
						length: "127",
						isNullable: false
					},
					{
						name: "neighborhood",
						type: "string",
						length: "127",
						isNullable: false
					},
					{
						name: "city",
						type: "string",
						length: "127",
						isNullable: false
					},
					{
						name: "state",
						type: "string",
						length: "2",
						isNullable: false
					},
					{
						name: "birth_date",
						type: "date",
						isNullable: false
					},
					{
						name: "createdAt",
						type: "timestamp",
						default: "CURRENT_TIMESTAMP()"
					},
					{
						name: "updatedAt",
						type: "timestamp",
						default: "CURRENT_TIMESTAMP()"
					}
				]
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("customers");
	}
}
