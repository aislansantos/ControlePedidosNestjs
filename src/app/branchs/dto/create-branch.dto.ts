import { IsEnum, IsOptional, IsString } from "class-validator";
import { Status } from "@enums/active.enum";

export class CreateBranchDto {
	/**
	 * Campo obrigatório - usado para identificar as filiais da empresa
	 * @example: Filial X
	 */
	@IsString()
	description: string;

	/**
	 * Campo obrigatório - usado para identificar cidade da filial
	 * @example: Varginha
	 */
	@IsString()
	city: string;

	/**
	 * Campo opcional - pode ser usado com o valor 0(inativo), padrão dele é 1(ativo).
	 */
	@IsOptional()
	@IsEnum(Status)
	status?: number;
}
