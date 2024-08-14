import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";
import { Status } from "../../../utils/enums/active.enum";

@Entity({
	name: "products"
})
export class ProductEntity {
	@PrimaryGeneratedColumn({
		unsigned: true
	})
	id?: number;

	@Column({
		length: 127,
		nullable: false
	})
	description: string;

	@Column("float", {
		nullable: false
	})
	selling_price: number;

	@Column("int")
	product_stock: number;

	@Column({
		default: Status.active
	})
	status?: number;

	@CreateDateColumn()
	created_at?: Date;

	@UpdateDateColumn()
	updated_at?: Date;
}
