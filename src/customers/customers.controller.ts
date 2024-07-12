import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CustomersService } from "./customers.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { AuthGuard } from "../guards/auth/auth.guard";
import { RoleGuard } from "../guards/role/role.guard";

@ApiTags("Customers")
@UseGuards(AuthGuard, RoleGuard)
@ApiBearerAuth("JWT-auth")
@Controller("customers")
export class CustomersController {
	constructor(private readonly customersService: CustomersService) {}

	@Post()
	create(@Body() createCustomerDto: CreateCustomerDto) {
		return this.customersService.create(createCustomerDto);
	}

	@Get()
	findAll() {
		return this.customersService.findAll();
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.customersService.findOne(+id);
	}

	@Patch(":id")
	update(
		@Param("id") id: string,
		@Body() updateCustomerDto: UpdateCustomerDto
	) {
		return this.customersService.update(+id, updateCustomerDto);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.customersService.remove(+id);
	}
}
