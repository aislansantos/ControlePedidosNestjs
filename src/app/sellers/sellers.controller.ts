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
import { CreateSellerDto } from "./dto/create-seller.dto";
import { UpdateSellerDto } from "./dto/update-seller.dto";
import { SellersService } from "./sellers.service";

@ApiTags("Branchs")
@UseGuards(AuthGuard, RoleGuard)
@ApiBearerAuth()
@Controller("sellers")
export class SellersController {
	constructor(private readonly sellersService: SellersService) {}

	@Roles(Role.Admin, Role.User)
	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Post()
	@UsePipes(new UpperCasePipe())
	create(@Body() createSellerDto: CreateSellerDto) {
		return this.sellersService.create(createSellerDto);
	}

	@Roles(Role.Admin, Role.User)
	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Get()
	findAll() {
		return this.sellersService.findAll();
	}

	@Roles(Role.Admin, Role.User)
	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Get(":id")
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.sellersService.findOne(+id);
	}

	@Roles(Role.Admin, Role.User)
	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Patch(":id")
	@UsePipes(new UpperCasePipe())
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() updateSellerDto: UpdateSellerDto
	) {
		return this.sellersService.update(+id, updateSellerDto);
	}

	@Roles(Role.Admin, Role.User)
	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Delete(":id")
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.sellersService.remove(+id);
	}
}
