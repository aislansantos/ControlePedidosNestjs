import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from "class-validator";
import { Status } from "../../../utils/enums/active.enum";

export class CreateProductDto {
	@IsString()
	description: string;

	@IsNumber({ maxDecimalPlaces: 2 })
	selling_price: number;

	@IsInt()
	product_stock: number;

	@IsOptional()
	@IsEnum(Status)
	status?: number;
}
