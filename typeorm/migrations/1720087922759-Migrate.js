"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migrate1720087922759 = void 0;
const typeorm_1 = require("typeorm");
class Migrate1720087922759 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
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
                    name: "telephone",
                    type: "varchar",
                    length: "15"
                },
                {
                    name: "status",
                    type: "int",
                    default: "1"
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
        }));
    }
    async down(queryRunner) {
        queryRunner.dropTable("customers");
    }
}
exports.Migrate1720087922759 = Migrate1720087922759;
//# sourceMappingURL=1720087922759-Migrate.js.map