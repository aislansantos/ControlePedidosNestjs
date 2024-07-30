import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { CustomerEntity } from "./entities/customer.entity";

@Injectable()
export class CustomersService {
	constructor(
		@InjectRepository(CustomerEntity)
		private readonly customersRepository: Repository<CustomerEntity>
	) {}

	public async create(createCustomerDto: CreateCustomerDto) {
		const newCustomer = this.customersRepository.create(createCustomerDto);

		return this.customersRepository.save(newCustomer);
	}

	public async findAll() {
		return await this.customersRepository.find({
			select: ["id", "name", "email"]
		});
	}

	public async findOne(id: number) {
		await this.exists(id);
		return await this.customersRepository.findOne({ where: { id } });
	}

	public async update(id: number, updateCustomerDto: UpdateCustomerDto) {
		await this.exists(id);
		return await this.customersRepository.update(id, updateCustomerDto);
	}

	public async remove(id: number) {
		await this.exists(id);
		await this.customersRepository.delete(id);
		return true;
	}

	public async exists(id: number) {
		if (
			!(await this.customersRepository.exists({
				where: { id }
			}))
		) {
			throw new NotFoundException(`O cliente com o id ${id} não existe`);
		}
	}
}
