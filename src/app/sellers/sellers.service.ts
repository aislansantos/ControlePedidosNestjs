import {
	BadRequestException,
	Injectable,
	NotFoundException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateSellerDto } from "./dto/create-seller.dto";
import { UpdateSellerDto } from "./dto/update-seller.dto";
import { SellerEntity } from "./entities/seller.entity";

@Injectable()
export class SellersService {
	constructor(
		@InjectRepository(SellerEntity)
		private readonly sellersRepository: Repository<SellerEntity>
	) {}
	public async create(createSellerDto: CreateSellerDto) {
		if (
			await this.sellersRepository.exists({
				where: {
					name: createSellerDto.name
				}
			})
		) {
			throw new BadRequestException("Este e-mail já existe.");
		}
		const seller = await this.sellersRepository.save(createSellerDto);
		return seller;
	}

	public async findAll() {
		return await this.sellersRepository.find({ relations: { branch: true } });
	}

	public async findOne(id: number) {
		try {
			return await this.sellersRepository.findOne({ where: { id } });
		} catch (error) {
			throw new NotFoundException(error.message);
		}
	}

	public async update(id: number, updateSellerDto: UpdateSellerDto) {
		return await this.sellersRepository.update(id, updateSellerDto);
	}

	public async remove(id: number): Promise<string> {
		if (!(await this.sellersRepository.exists({ where: { id } }))) {
			throw new NotFoundException(`usuario com o id ${id}, não existe.`);
		}

		await this.sellersRepository.delete(id);

		return "Vendedor apagado";
	}
}
