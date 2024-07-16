import {
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
	Matches
} from "class-validator";
import { Validate } from "../../utils/decorators/dateValidate.decorator";
import { Status } from "../../utils/enums/active.enum";

export class CreateCustomerDto {
	/**
	 * Campo obrigatório -  usado para o identificação do usuário.
	 * @example Fulano de Tal
	 */
	@IsString()
	name: string;

	/**
	 * Campo obrigatório -  usado para o login e forget de senha.
	 * @example teste@teste.com.br
	 */
	@IsEmail()
	email: string;

	/**
	 * Campo opcional.
	 * @example (35)99999-9999
	 */
	@IsOptional()
	@IsString()
	telephone?: string;

	/**
	 * Campo opcional - pode ser usado com o valor 0(inativo), padrão dele é 1(ativo).
	 */
	@IsOptional()
	@IsEnum(Status)
	status?: number;

	/**
	 * Campo obrigatório -  envio de cobrança/entrega.
	 * @example Rua X, 25.
	 */
	@IsString()
	address: string;

	/**
	 * Campo obrigatório -  envio de cobrança/entrega.
	 * @example Bairro Tal
	 */
	@IsString()
	neighborhood: string;

	/**
	 * Campo obrigatório -  envio de cobrança/entrega.
	 * @example Varginha.
	 */
	@IsString()
	city: string;

	/**
	 * Campo obrigatório -  envio de cobrança/entrega.
	 * @example MG.
	 */
	@IsString()
	state: string;

	/**
	 * Campo opcional - data de nascimento do usuário, em formato de ISO8601.
	 * @example "1990-01-01"
	 */
	@IsOptional()
	@Matches(/^((19|20)[0-9]{2})-(0[0-9]|1[0-2])-([0-2][0-9]|3[0-1])$/)
	@Validate({ message: "Invalid Date" })
	birthDate?: string;
}
