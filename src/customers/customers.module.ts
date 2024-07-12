import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";
import { CustomersController } from "./customers.controller";
import { CustomersService } from "./customers.service";
import { CustomerEntity } from "./entities/customer.entity";

@Module({
	imports: [
		UsersModule,
		AuthModule,
		TypeOrmModule.forFeature([CustomerEntity])
	],
	controllers: [CustomersController],
	providers: [CustomersService],
	exports: [CustomersService]
})
export class CustomersModule {}
