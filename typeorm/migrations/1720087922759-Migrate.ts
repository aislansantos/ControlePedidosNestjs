import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Migrate1720087922759 implements MigrationInterface {
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
						type: "varchar",
						length: "127"
					},
					{
						name: "email",
						type: "varchar",
						length: "127",
						isUnique: true
					},
					{
						name: "address",
						type: "varchar",
						length: "127"
					},
					{
						name: "neighborhood",
						type: "varchar",
						length: "127"
					},
					{
						name: "city",
						type: "varchar",
						length: "127"
					},
					{
						name: "state",
						type: "varchar",
						length: "2"
					},
					{
						name: "birthDate",
						type: "date",
						isNullable: true
					},
					{
						name: "updatedAt",
						type: "timestamp",
						default: "CURRENT_TIMESTAMP()"
					},
					{
						name: "createdAt",
						type: "timestamp",
						default: "CURRENT_TIMESTAMP()"
					}
				]
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		queryRunner.dropTable("customers");
	}
}
