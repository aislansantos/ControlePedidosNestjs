import {
	IsDateString,
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
	IsStrongPassword
} from "class-validator";
import { Status } from "../../utils/enums/active.enum";
import { Role } from "../../utils/enums/role.enum";

export class CreateUserDto {
	/**
	 * Campo obrigatório -  usado para o identificação do usuário.
	 * @example Fulano de Tal
	 */
	@IsString()
	name: string;

	/**
	 * Campo opcional - pode ser usado com o valor 0(inativo), padrão dele é 1(ativo).
	 */
	@IsEnum(Status)
	@IsOptional()
	status?: number;

	/**
	 * Campo obrigatório -  usado para o login e forget de senha.
	 * @example teste@teste.com.br
	 */
	@IsEmail()
	email: string;

	/**
	 * Campo obrigatório - senha para login do usuário - tem de ter caractere pelo menos 6 caracteres sendo 1 maiusculo, 1 minusculo, 1 numero."
	 * @example Aa123456
	 */
	@IsStrongPassword(
		{
			minLength: 6,
			minSymbols: 0
		},
		{
			message:
				"Tem de ter caractere pelo menos 6 caracteres sendo 1 maiusculo, 1 minusculo, 1 numero."
		}
	)
	password: string;

	/**
	 * Campo opcional - data de nascimento do usuário, em formato de ISO8601.
	 * @example "1990-01-01"
	 */
	@IsOptional()
	@IsDateString()
	birthDate?: Date;

	/**
	 * Campo opcional - campo que atribui usuário como Adm ou  User, para as regras de acesso, seguindo RBAC (Role-based access control - controle de acesso baseado em função).
	 * Pelo register o usuário é cadastrado com o padrão de User, sendo algum Admin resposavel de Role.
	 */
	@IsOptional()
	@IsEnum(Role)
	role?: number;
}
