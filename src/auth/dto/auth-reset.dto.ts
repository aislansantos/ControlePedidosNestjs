import { ApiProperty } from "@nestjs/swagger";
import { IsJWT, IsString, MinLength } from "class-validator";

export class AuthResetDto {
	@ApiProperty()
	@IsString()
	@MinLength(6)
	password: string;

	@ApiProperty()
	@IsJWT()
	token: string;
}
