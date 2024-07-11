import { IsDefined, IsEmail, IsStrongPassword } from "class-validator";

export class AuthLoginDto {
	/**
	 * Campo obrigatório -  usado para o login e forget de senha.
	 * @example teste@teste.com.br
	 */
	@IsDefined()
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
}
