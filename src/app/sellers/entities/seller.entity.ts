import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";
import { Status } from "../../../utils/enums/active.enum";
import { BranchEntity } from "../../branchs/entities/branch.entity";

@Entity({
	name: "sellers"
})
export class SellerEntity {
	@PrimaryGeneratedColumn({
		unsigned: true
	})
	id?: number;

	@Column({
		length: 127,
		unique: true
	})
	name: string;

	@Column({
		unsigned: true
	})
	id_branch: number;

	@Column({
		default: Status.active
	})
	status?: number;

	@CreateDateColumn()
	createdAt?: Date;

	@UpdateDateColumn()
	updatedAt?: Date;

	@ManyToOne(() => BranchEntity, (branch) => branch.sellers)
	@JoinColumn({ name: "id_branch" })
	branch: BranchEntity;
}
