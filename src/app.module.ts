import { MailerModule } from "@nestjs-modules/mailer";
import { PugAdapter } from "@nestjs-modules/mailer/dist/adapters/pug.adapter";
import { Module, forwardRef } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { CustomersModule } from "./customers/customers.module";
import { CustomerEntity } from "./customers/entities/customer.entity";
import { UserEntity } from "./users/entities/user.entity";
import { UsersModule } from "./users/users.module";

@Module({
	/* 
    ! Resolvendo a questão de dependencia circular, usando o forwardRef(),
    ! temos de usar nos modulos que estão com a dependencia circular.
    ! Neste caso userModule e AuthModule
  */
	imports: [
		// Para enxergar o dados do .ENV
		ConfigModule.forRoot({
			// Configuração para envergar os dados de teste das variaveis de ambiente
			envFilePath: process.env.ENV === "test" ? ".env.test" : ".env"
		}),
		// Ferramenta para precaver ataques, RateLimit
		ThrottlerModule.forRoot([
			{
				ttl: 60000,
				limit: 10
			}
		]),
		CustomersModule,
		forwardRef(() => UsersModule),
		forwardRef(() => AuthModule),
		TypeOrmModule.forRoot({
			type: "mysql",
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE,
			entities: [UserEntity, CustomerEntity],
			synchronize:
				process.env.ENV === "development" || process.env.ENV === "test",
			charset: "utf8mb4_unicode_ci", // Ajuste a codificação de acordo com o seu banco de dados
			retryAttempts: 10, // Número de tentativas de reconexão
			retryDelay: 1000 // Delay entre as tentativas de reconexão (em milissegundos)
		}),
		MailerModule.forRoot({
			transport: {
				host: "smtp.gmail.com",
				port: 587,
				secure: false,
				auth: {
					user: process.env.EMAILFROM,
					pass: process.env.SENHAAPP
				}
			},
			defaults: {
				from: '"Destiney Yost" <destiney.yost@ethereal.email>'
			},
			template: {
				dir: __dirname + "/templates",
				adapter: new PugAdapter(),
				options: {
					strict: true
				}
			}
		})
	],
	controllers: [AppController],
	// Aqui protegempos toda a aplicação de tentativas seguida de acesso, podemos colocar como um guard em uma rota especifica
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		}
	]
})
export class AppModule {}
