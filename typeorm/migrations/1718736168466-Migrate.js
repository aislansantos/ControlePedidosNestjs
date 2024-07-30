"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migrate1718732352964 = void 0;
const typeorm_1 = require("typeorm");
class Migrate1718732352964 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "users",
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
                    length: "63"
                },
                {
                    name: "email",
                    type: "varchar",
                    length: "127",
                    isUnique: true
                },
                {
                    name: "password",
                    type: "varchar",
                    length: "127"
                },
                {
                    name: "birthDate",
                    type: "date",
                    isNullable: true
                },
                {
                    name: "role",
                    type: "int",
                    default: "1"
                },
                {
                    name: "status",
                    type: "int",
                    default: "1"
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
        }));
    }
    async down(queryRunner) {
        queryRunner.dropTable("users");
    }
}
exports.Migrate1718732352964 = Migrate1718732352964;
//# sourceMappingURL=1718736168466-Migrate.js.map