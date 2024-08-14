import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	UseGuards,
	UsePipes
} from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../../guards/auth/auth.guard";
import { RoleGuard } from "../../guards/role/role.guard";
import { Roles } from "../../utils/decorators/roles.decorator";
import { Role } from "../../utils/enums/role.enum";
import { UpperCasePipe } from "../../utils/pipes/upperCase.pipe";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductsService } from "./products.service";

@ApiTags("Customers")
@UseGuards(AuthGuard, RoleGuard)
@ApiBearerAuth("JWT-auth")
@Controller("products")
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Roles(Role.User, Role.Admin)
	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Post()
	@UsePipes(new UpperCasePipe())
	public async create(@Body() createProductDto: CreateProductDto) {
		return this.productsService.create(createProductDto);
	}

	@Roles(Role.User, Role.Admin)
	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Get()
	public async findAll() {
		return this.productsService.findAll();
	}

	@Roles(Role.User, Role.Admin)
	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Get(":id")
	public async findOne(@Param("id", ParseIntPipe) id: number) {
		return this.productsService.findOne(id);
	}

	@Roles(Role.User, Role.Admin)
	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Patch(":id")
	@UsePipes(new UpperCasePipe())
	public async update(
		@Param("id", ParseIntPipe) id: number,
		@Body() updateProductDto: UpdateProductDto
	) {
		return this.productsService.update(id, updateProductDto);
	}

	@Roles(Role.User, Role.Admin)
	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Delete(":id")
	public async remove(@Param("id", ParseIntPipe) id: number) {
		return this.productsService.remove(id);
	}
}
