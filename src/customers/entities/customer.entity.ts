import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryColumn,
	UpdateDateColumn
} from "typeorm";
import { Status } from "../../utils/enums/active.enum";

@Entity({
	name: "customers"
})
export class CustomerEntity {
	@PrimaryColumn({
		unsigned: true
	})
	id?: number;

	@Column({
		length: 127
	})
	name: string;

	@Column({
		length: 127,
		unique: true
	})
	email: string;

	@Column({
		length: 15
	})
	telephone?: string;

	@Column({
		default: Status.active
	})
	status?: number;

	@Column({
		length: 127
	})
	address: string;

	@Column({
		length: 127
	})
	neighborhood: string;

	@Column({
		length: 127
	})
	city: string;

	@Column({
		length: 2
	})
	state: string;

	@Column({
		type: "date",
		nullable: true
	})
	birthDate?: Date;

	@CreateDateColumn()
	createdAt?: Date;

	@UpdateDateColumn()
	updatedAt?: Date;

	constructor(customer?: Partial<CustomerEntity>) {
		this.id = customer?.id;
		this.name = customer?.name;
		this.email = customer?.email;
		this.telephone = customer?.telephone;
		this.address = customer?.address;
		this.neighborhood = customer?.neighborhood;
		this.city = customer?.city;
		this.state = customer?.state;
		this.birthDate = customer?.birthDate;
		this.updatedAt = customer?.updatedAt;
		this.createdAt = customer?.createdAt;
	}
}
