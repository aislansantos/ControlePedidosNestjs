import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Migrate1721851889105 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "branchs",
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
						name: "description",
						type: "varchar",
						length: "127"
					},
					{
						name: "city",
						type: "varchar",
						length: "127"
					},
					{
						name: "status",
						type: "int",
						default: 1
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
		queryRunner.dropTable("branchs");
	}
}
