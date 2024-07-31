import { PartialType } from "@nestjs/swagger";
import { CreateBranchDto } from "@branchs/dto/create-branch.dto";

export class UpdateBranchDto extends PartialType(CreateBranchDto) {}
