import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";
import { SellerEntity } from "./entities/seller.entity";
import { SellersController } from "./sellers.controller";
import { SellersService } from "./sellers.service";

@Module({
	imports: [UsersModule, AuthModule, TypeOrmModule.forFeature([SellerEntity])],
	controllers: [SellersController],
	providers: [SellersService],
	exports: [SellersService]
})
export class SellersModule {}
