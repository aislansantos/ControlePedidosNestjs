import {
	BadRequestException,
	Injectable,
	NotFoundException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductEntity } from "./entities/product.entity";

@Injectable()
export class ProductsService {
	constructor(
		@InjectRepository(ProductEntity)
		private readonly productsRepository: Repository<ProductEntity>
	) {}
	public async create(createProductDto: CreateProductDto) {
		const descriptionProduct = createProductDto.description;
		if (
			this.productsRepository.exists({
				where: {
					description: descriptionProduct
				}
			})
		)
			throw new BadRequestException("Produto já existe cadastrado!");

		const newProduct = this.productsRepository.create(createProductDto);
		return this.productsRepository.save(newProduct);
	}

	public async findAll() {
		return await this.productsRepository.find();
	}

	public async findOne(id: number) {
		await this.notExists(id);
		return await this.productsRepository.findOne({ where: { id } });
	}

	public async update(id: number, updateProductDto: UpdateProductDto) {
		await this.notExists(id);
		await this.productsRepository.update(id, updateProductDto);
		return `Produto altetado.`;
	}

	public async remove(id: number) {
		await this.notExists(id);
		await this.productsRepository.delete(id);
		return `Produto deletado.`;
	}

	public async notExists(id: number) {
		if (
			!(await this.productsRepository.exists({
				where: { id }
			}))
		)
			throw new NotFoundException(`O produto com o id ${id} não existe.`);
	}
}
