import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEmail, IsString, MinLength } from "class-validator";

export class AuthLoginDto {
	@ApiProperty()
	@IsDefined()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsDefined()
	@IsString()
	@MinLength(6)
	password: string;
}
