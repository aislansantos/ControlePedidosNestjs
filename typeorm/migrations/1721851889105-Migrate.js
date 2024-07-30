"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migrate1721851889105 = void 0;
const typeorm_1 = require("typeorm");
class Migrate1721851889105 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
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
                }
            ]
        }));
    }
    async down(queryRunner) {
        queryRunner.dropTable("branchs");
    }
}
exports.Migrate1721851889105 = Migrate1721851889105;
//# sourceMappingURL=1721851889105-Migrate.js.map