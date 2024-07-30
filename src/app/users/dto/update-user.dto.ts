// Forma antiga com PartialType do mapped-types
// import { PartialType } from "@nestjs/mapped-types";
// Forma nova para aparece a lista de itens a ser alteradas pelo swagger no update
import { PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {}
