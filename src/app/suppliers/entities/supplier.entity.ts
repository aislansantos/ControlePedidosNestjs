import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Status } from "../../../utils/enums/active.enum";

@Entity({
	name: "suppliers"
})
export class Supplier {
	/**
	 * Campo não preenchido - gerado automaticamente pelo sistema e usado para o identificação do fornecedor em processos internos.
	 * @example 1
	 */
	@PrimaryGeneratedColumn({
		unsigned: true
	})
	id?: number;

	/**
	 * Campo obrigatório -  usado para o identificação do cliente.
	 * @example Fulano de Tal
	 */
	@Column({
		length: 127
	})
	name: string;

	/**
	 * Campo obrigatório -  usado para cominucação com o fornecedor.
	 * @example teste@teste.com.br
	 */
	@Column({
		length: 127
	})
	email: string;

	/**
	 * Campo opcional.
	 * @example (35)99999-9999
	 */
	@Column({
		length: 15
	})
	telefone?: string;

	/**
	 * Campo opcional - pode ser usado com o valor 0(inativo), padrão dele é 1(ativo).
	 */
	@Column({
		default: Status.active
	})
	status?: number;
}
