import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateBranchDto } from "./dto/create-branch.dto";
import { UpdateBranchDto } from "./dto/update-branch.dto";
import { BranchEntity } from "./entities/branch.entity";

@Injectable()
export class BranchesService {
	constructor(
		@InjectRepository(BranchEntity)
		private readonly branchRepository: Repository<BranchEntity>
	) {}
	public async create(createBranchDto: CreateBranchDto) {
		return "This action adds a new branch";
	}

	public async findAll() {
		return await this.branchRepository.find();
	}

	public async findOne(id: number) {
		return `This action returns a #${id} branch`;
	}

	public async update(id: number, updateBranchDto: UpdateBranchDto) {
		return `This action updates a #${id} branch`;
	}

	public async remove(id: number) {
		return `This action removes a #${id} branch`;
	}
}
