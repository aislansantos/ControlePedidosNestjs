import { IsEmail } from "class-validator";

export class AuthForgetDto {
	/**
	 * Campo obrigatório -  usado para o login e forget de senha.
	 * @example teste@teste.com.br
	 */
	@IsEmail()
	email: string;
}
