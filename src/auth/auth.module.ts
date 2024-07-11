import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../users/entities/user.entity";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
	imports: [
		JwtModule.register({
			secret: String(process.env.JWT_SECRET)
		}),
		/* 
      ! Resolvendo a questão de dependencia circular, usando o forwardRef(),
      ! temos de usar nos modulos que estão com a dependencia circular.
      ! Neste caso userModule e AuthModule
    */
		forwardRef(() => UsersModule),
		TypeOrmModule.forFeature([UserEntity])
	],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService]
})
export class AuthModule {}
