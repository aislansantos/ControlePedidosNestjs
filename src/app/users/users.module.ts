import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { UserEntity } from "./entities/user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
	/* 
    ! Resolvendo a questão de dependencia circular, usando o forwardRef(),
    ! temos de usar nos modulos que estão com a dependencia circular.
    ! Neste caso userModule e AuthModule
  */
	imports: [
		forwardRef(() => AuthModule),
		TypeOrmModule.forFeature([UserEntity])
	],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService]
})
export class UsersModule {}
