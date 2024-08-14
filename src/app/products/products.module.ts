import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../../app/auth/auth.module";
import { UsersModule } from "../../app/users/users.module";
import { ProductEntity } from "./entities/product.entity";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

@Module({
	imports: [UsersModule, AuthModule, TypeOrmModule.forFeature([ProductEntity])],
	controllers: [ProductsController],
	providers: [ProductsService],
	exports: [ProductsService]
})
export class ProductsModule {}
