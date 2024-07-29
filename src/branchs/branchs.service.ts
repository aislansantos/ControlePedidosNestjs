import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateBranchDto } from "./dto/create-branch.dto";
import { UpdateBranchDto } from "./dto/update-branch.dto";
import { BranchEntity } from "./entities/branch.entity";

@Injectable()
export class BranchsService {
	constructor(
		@InjectRepository(BranchEntity)
		private readonly branchRepository: Repository<BranchEntity>
	) {}
	public async create(createBranchDto: CreateBranchDto) {
		const newBranch = this.branchRepository.create(createBranchDto);

		return this.branchRepository.save(newBranch);
	}

	public async findAll() {
		return await this.branchRepository.find();
	}

	public async findOne(id: number) {
		await this.exists(id);
		return await this.branchRepository.findOne({ where: { id } });
	}

	public async update(id: number, updateBranchDto: UpdateBranchDto) {
		await this.exists(id);
		return await this.branchRepository.update(id, updateBranchDto);
	}

	public async remove(id: number) {
		await this.exists(id);
		await this.branchRepository.delete(id);
		return true;
	}

	public async exists(id: number) {
		if (!(await this.branchRepository.exists({ where: { id } }))) {
			throw new NotFoundException(`A filial com o id ${id} não existe`);
		}
	}
}
