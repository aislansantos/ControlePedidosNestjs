import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Status } from "../../utils/enums/active.enum";

@Entity({
	name: "branches"
})
export class BranchEntity {
	/**
	 * Campo não preenchido - gerado automaticamente pelo sistema e usado para o identificação do usuário em processos internos.
	 * @example 1
	 */
	@PrimaryGeneratedColumn({
		unsigned: true
	})
	id?: number;

	/**
	 * Campo obrigatório - usado para identificar as filiais da empresa
	 * @example: Filial X
	 */
	@Column({
		length: 127
	})
	description: string;

	/**
	 * Campo obrigatório - usado para identificar cidade da filial
	 * @example: Varginha
	 */
	@Column({
		length: 127
	})
	city: string;

	/**
	 * Campo opcional - pode ser usado com o valor 0(inativo), padrão dele é 1(ativo).
	 */
	@Column({
		default: Status.active
	})
	status?: number;
}
