import { AuthModule } from "@auth/auth.module";
import { BranchsController } from "@branchs/branchs.controller";
import { BranchsService } from "@branchs/branchs.service";
import { BranchEntity } from "@branchs/entities/branch.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "@users/users.module";

@Module({
	imports: [UsersModule, AuthModule, TypeOrmModule.forFeature([BranchEntity])],
	controllers: [BranchsController],
	providers: [BranchsService],
	exports: [BranchsService]
})
export class BranchsModule {}
