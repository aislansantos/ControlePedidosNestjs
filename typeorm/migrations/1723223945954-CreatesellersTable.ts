import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey
} from "typeorm";

export class CreatesellersTable1723223945954 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "sellers",
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
						length: "127",
						isNullable: false
					},
					{
						name: "id_branch",
						type: "int",
						isNullable: false,
						unsigned: true
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
		await queryRunner.createForeignKey(
			"sellers",
			new TableForeignKey({
				columnNames: ["id_branch"],
				referencedColumnNames: ["id"],
				referencedTableName: "branchs",
				onDelete: "CASCADE",
				onUpdate: "CASCADE"
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("sellers");
	}
}
