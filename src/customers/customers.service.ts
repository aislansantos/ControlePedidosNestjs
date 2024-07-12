import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { CustomerEntity } from "./entities/customer.entity";

@Injectable()
export class CustomersService {
	constructor(
		@InjectRepository(CustomerEntity)
		private readonly customerRepository: Repository<CustomerEntity>
	) {}

	public async create(createCustomerDto: CreateCustomerDto) {
		return "This action adds a new customer";
	}

	public async findAll() {
		return await this.customerRepository.find();
	}

	public async findOne(id: number) {
		return `This action returns a #${id} customer`;
	}

	public async update(id: number, updateCustomerDto: UpdateCustomerDto) {
		return `This action updates a #${id} customer`;
	}

	public async remove(id: number) {
		return `This action removes a #${id} customer`;
	}

	public async exists() {}
}
