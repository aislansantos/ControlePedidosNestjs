import { IsDateString, IsEmail, IsOptional, IsString } from "class-validator";

export class CreateCustomerDto {
	@IsString()
	name: string;

	@IsEmail()
	email: string;

	@IsOptional()
	@IsString()
	telephone?: string;

	@IsString()
	address: string;

	@IsString()
	neighborhood: string;

	@IsString()
	city: string;

	@IsString()
	state: string;

	@IsOptional()
	@IsDateString()
	birthDate: Date;
}
