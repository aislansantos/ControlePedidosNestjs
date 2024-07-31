import { Status } from "@enums/active.enum";
import { Role } from "@enums/role.enum";
import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";

@Entity({
	name: "users"
})
export class UserEntity {
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
		length: 63
	})
	name: string;

	/**
	 * Campo obrigatório -  usado para o login e forget de senha.
	 * @example teste@teste.com.br
	 */
	@Column({
		length: 127,
		unique: true
	})
	email: string;

	/**
	 * Campo obrigatório - senha para login do usuário - tem de ter caractere pelo menos 6 caracteres sendo 1 maiusculo, 1 minusculo, 1 numero."
	 * @example Aa123456
	 */
	@Column({
		length: 127
	})
	password: string;

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
	 * Campo opcional - campo que atribui usuário como Adm ou  User, para as regras de acesso, seguindo RBAC (Role-based access control - controle de acesso baseado em função).
	 * Pelo register o usuário é cadastrado com o padrão de User, sendo algum Admin resposavel de Role.
	 */
	@Column({
		default: Role.User
	})
	role?: number;

	/**
	 * Campo opcional - pode ser usado com o valor 0(inativo), padrão dele é 1(ativo).
	 */
	@Column({
		default: Status.active
	})
	status?: number;

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

	constructor(user?: Partial<UserEntity>) {
		this.id = user?.id;
		this.name = user?.name;
		this.email = user?.email;
		this.password = user?.password;
		this.birthDate = user?.birthDate;
		this.role = user?.role;
		this.status = user?.status;
		this.createdAt = user?.createdAt;
		this.updatedAt = user?.updatedAt;
	}
}
