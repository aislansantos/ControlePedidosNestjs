import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";
import { BranchsController } from "./branchs.controller";
import { BranchsService } from "./branchs.service";
import { BranchEntity } from "./entities/branch.entity";

@Module({
	imports: [UsersModule, AuthModule, TypeOrmModule.forFeature([BranchEntity])],
	controllers: [BranchsController],
	providers: [BranchsService],
	exports: [BranchsService]
})
export class BranchsModule {}
