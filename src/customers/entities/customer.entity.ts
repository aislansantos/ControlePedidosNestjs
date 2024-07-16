import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";
import { Status } from "../../utils/enums/active.enum";

@Entity({
	name: "customers"
})
export class CustomerEntity {
	/**
	 * Campo não preenchido - gerado automaticamente pelo sistema e usado para o identificação do usuário em processos internos.
	 * @example 1
	 */
	@PrimaryGeneratedColumn({
		unsigned: true
	})
	id?: number;

	/**
	 * Campo obrigatório -  usado para o identificação do usuário.
	 * @example Fulano de Tal
	 */
	@Column({
		length: 127
	})
	name: string;

	/**
	 * Campo obrigatório -  usado para o login e forget de senha.
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
	telephone?: string;

	/**
	 * Campo opcional - pode ser usado com o valor 0(inativo), padrão dele é 1(ativo).
	 */
	@Column({
		default: Status.active
	})
	status?: number;

	/**
	 * Campo obrigatório -  envio de cobrança/entrega.
	 * @example Rua X, 25.
	 */
	@Column({
		length: 127
	})
	address: string;

	/**
	 * Campo obrigatório -  envio de cobrança/entrega.
	 * @example Bairro Tal
	 */
	@Column({
		length: 127
	})
	neighborhood: string;

	/**
	 * Campo obrigatório -  envio de cobrança/entrega.
	 * @example Varginha.
	 */
	@Column({
		length: 127
	})
	city: string;

	/**
	 * Campo obrigatório -  envio de cobrança/entrega.
	 * @example MG.
	 */
	@Column({
		length: 2
	})
	state: string;

	/**
	 * Campo opcional - data de nascimento do usuário, em formato de ISO8601.
	 * @example "1990-01-01"
	 */
	@Column({
		type: "date",
		nullable: true
	})
	birthDate?: Date;

	/**
	 * Campo não preenchido - gerado automaticamente pelo sistema quando o registro é criado.
	 */
	@CreateDateColumn()
	createdAt?: Date;

	/**
	 * Campo não preenchido - gerado automaticamente pelo sistema quando o registro alterado.
	 */
	@UpdateDateColumn()
	updatedAt?: Date;
}
