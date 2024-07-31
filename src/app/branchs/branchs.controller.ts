import { AuthGuard } from "@authGuard/auth.guard";
import { BranchsService } from "@branchs/branchs.service";
import { CreateBranchDto } from "@branchs/dto/create-branch.dto";
import { UpdateBranchDto } from "@branchs/dto/update-branch.dto";
import { Roles } from "@decorators/roles.decorator";
import { Role } from "@enums/role.enum";
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
import { UpperCasePipe } from "@pipes/upperCase.pipe";
import { RoleGuard } from "@roleGuard/role.guard";

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
	@UsePipes(new UpperCasePipe())
	public async create(@Body() createBranchDto: CreateBranchDto) {
		return await this.branchsService.create(createBranchDto);
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
		return this.branchsService.findOne(id);
	}

	@Roles(Role.Admin, Role.User)
	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Patch(":id")
	@UsePipes(new UpperCasePipe())
	public async update(
		@Param("id", ParseIntPipe) id: number,
		@Body()
		updateBranchDto: UpdateBranchDto
	) {
		return await this.branchsService.update(id, updateBranchDto);
	}

	@Roles(Role.Admin, Role.User)
	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Delete(":id")
	public async remove(@Param("id", ParseIntPipe) id: number) {
		return this.branchsService.remove(id);
	}
}
