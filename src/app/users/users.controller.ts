import { AuthGuard } from "@authGuard/auth.guard";
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
	UseGuards
} from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { RoleGuard } from "@roleGuard/role.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@ApiTags("Users")
@UseGuards(AuthGuard, RoleGuard)
@ApiBearerAuth("JWT-auth")
@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Roles(Role.Admin)
	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Post()
	public async create(@Body() createUserDto: CreateUserDto) {
		return await this.usersService.create(createUserDto);
	}

	@Roles(Role.Admin, Role.User)
	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Get()
	public async findAll() {
		return await this.usersService.findAll();
	}

	@Roles(Role.Admin)
	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Get(":id")
	public async findOne(@Param("id", ParseIntPipe) id: number) {
		return await this.usersService.findOne(+id);
	}

	@Roles(Role.Admin)
	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Patch(":id")
	public async update(
		@Param("id", ParseIntPipe) id: number,
		@Body() updateUserDto: UpdateUserDto
	) {
		return await this.usersService.update(id, updateUserDto);
	}

	@Roles(Role.Admin)
	@ApiConsumes("application/x-www-form-urlencoded")
	@ApiConsumes("application/json")
	@Delete(":id")
	public async remove(@Param("id", ParseIntPipe) id: number) {
		return await this.usersService.remove(+id);
	}
}
