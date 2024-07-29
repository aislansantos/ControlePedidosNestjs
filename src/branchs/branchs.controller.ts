import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	UseGuards
} from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../guards/auth/auth.guard";
import { RoleGuard } from "../guards/role/role.guard";
import { Roles } from "../utils/decorators/roles.decorator";
import { Role } from "../utils/enums/role.enum";
import { BranchsService } from "./branchs.service";
import { CreateBranchDto } from "./dto/create-branch.dto";
import { UpdateBranchDto } from "./dto/update-branch.dto";

@ApiTags("Branchs")
@UseGuards(AuthGuard, RoleGuard)
@ApiBearerAuth("JWT-auth")
@Controller("branchs")
export class BranchsController {
	constructor(private readonly branchsService: BranchsService) {}

	@Roles(Role.Admin, Role.User)
	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Post()
	public async create(@Body() createBranchDto: CreateBranchDto) {
		return this.branchsService.create(createBranchDto);
	}

	@Roles(Role.Admin, Role.User)
	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Get()
	public async findAll() {
		return this.branchsService.findAll();
	}

	@Roles(Role.Admin, Role.User)
	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Get(":id")
	public async findOne(@Param("id", ParseIntPipe) id: number) {
		return this.branchsService.findOne(+id);
	}

	@Roles(Role.Admin, Role.User)
	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Patch(":id")
	public async update(
		@Param("id", ParseIntPipe) id: number,
		@Body() updateBranchDto: UpdateBranchDto
	) {
		return this.branchsService.update(+id, updateBranchDto);
	}

	@Roles(Role.Admin, Role.User)
	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Delete(":id")
	public async remove(@Param("id", ParseIntPipe) id: number) {
		return this.branchsService.remove(+id);
	}
}
