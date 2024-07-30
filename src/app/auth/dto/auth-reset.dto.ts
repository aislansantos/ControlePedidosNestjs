import { IsJWT, IsStrongPassword } from "class-validator";

export class AuthResetDto {
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
	 * Campo obrigatório - gerado a partir do forget enviado para o email.
	 */
	@IsJWT()
	token: string;
}
