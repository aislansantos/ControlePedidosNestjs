"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const typeorm_1 = require("typeorm");
const branch_entity_1 = require("@branchs/entities/branch.entity");
const customer_entity_1 = require("@customers/entities/customer.entity");
const user_entity_1 = require("@users/entities/user.entity");
const main_seeder_1 = require("../src/utils/seeds/main.seeder");
dotenv.config({
    path: process.env.ENV === "test" ? ".env.test" : ".env"
});
const port = Number(process.env.DB_PORT);
const options = {
    type: "mysql",
    host: process.env.DB_HOST,
    port: port,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [user_entity_1.UserEntity, customer_entity_1.CustomerEntity, branch_entity_1.BranchEntity],
    migrations: [`${__dirname}/migrations/**/*.ts`],
    seeds: [main_seeder_1.MainSeeder]
};
const dataSource = new typeorm_1.DataSource(options);
exports.default = dataSource;
//# sourceMappingURL=data-source.js.map