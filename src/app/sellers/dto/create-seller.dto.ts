import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Status } from "../../../utils/enums/active.enum";

export class CreateSellerDto {
	@IsString()
	name: string;

	@IsEnum(Status)
	@IsOptional()
	status?: number;

	@IsNumber()
	id_branch: number;
}
