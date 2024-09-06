import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { Status } from "../../../utils/enums/active.enum";

export class CreateSupplierDto {
	/**
	 * Campo obrigatório -  usado para o identificação do fornecedor.
	 * @example Fulano de Tal
	 */
	@IsString()
	description: string;

	/**
	 * Campo obrigatório -  comunicação com o fornecedor
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
	telehone?: string;

	/**
	 * Campo opcional - pode ser usado com o valor 0(inativo), padrão dele é 1(ativo).
	 */
	@IsOptional()
	@IsEnum(Status)
	status?: number;
}
