import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthGuard } from "../guards/auth/auth.guard";
import { RoleGuard } from "../guards/role/role.guard";
import { Status } from "../utils/enums/active.enum";
import { BranchsController } from "./branchs.controller";
import { BranchsService } from "./branchs.service";
import { CreateBranchDto } from "./dto/create-branch.dto";
import { UpdateBranchDto } from "./dto/update-branch.dto";
import { BranchEntity } from "./entities/branch.entity";

@Injectable()
export class AuthGuardMock implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		request.user = { id: 1, username: "testUser" };
		return true;
	}
}

const roleGuardMock: CanActivate = {
	canActivate: jest.fn(() => true)
};

const branchsEntityList: BranchEntity[] = [
	{
		id: 1,
		description: "Filial 1",
		city: "Cidade Teste",
		status: Status.active
	},
	{
		id: 2,
		description: "Filial 2",
		city: "Cidade Teste",
		status: Status.active
	},
	{
		id: 3,
		description: "Filial 3",
		city: "Cidade Teste",
		status: Status.inactive
	}
];

const createBrancheDTO: CreateBranchDto = {
	description: "Filial 4",
	city: "Cidade Teste4"
};

const updateBrancheDTO: UpdateBranchDto = {
	description: "Filial Alterada"
};

describe("BranchsController", () => {
	let branchsController: BranchsController;
	let branchsService: BranchsService;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [BranchsController],
			providers: [
				{
					provide: BranchsService,
					useValue: {
						create: jest.fn().mockResolvedValue(createBrancheDTO),
						findAll: jest.fn().mockResolvedValue(branchsEntityList),
						findOne: jest.fn().mockResolvedValue(branchsEntityList[0]),
						update: jest.fn().mockResolvedValue(updateBrancheDTO),
						remove: jest.fn(),
						save: jest.fn().mockResolvedValue(createBrancheDTO)
					}
				}
			]
		})
			.overrideGuard(AuthGuard)
			.useValue(AuthGuardMock)
			.overrideGuard(RoleGuard)
			.useValue(roleGuardMock)
			.compile();

		branchsController = module.get<BranchsController>(BranchsController);
		branchsService = module.get<BranchsService>(BranchsService);
	});

	it("should be defined", () => {
		expect(branchsController).toBeDefined();
		expect(branchsService).toBeDefined();
	});

	describe("findAll", () => {
		it("should found a list branchs successfully", async () => {
			// Act
			const result = await branchsController.findAll();
			console.assert(result);
			// Assert
			expect(result).toBe(branchsEntityList);
			expect(typeof result).toBe("object");
			expect(branchsService.findAll).toHaveBeenCalledTimes(1);
		});
		it("should throw an exception - findAll", () => {
			// Arrange
			jest.spyOn(branchsService, "findAll").mockRejectedValueOnce(new Error());
			// Assert
			expect(branchsService.findAll()).rejects.toThrow();
		});
	});

	describe("findOne", () => {
		it("should found one branch successfully", async () => {
			// Act
			const result = await branchsController.findOne(1);
			// Assert
			expect(result).toBe(branchsEntityList[0]);
		});
		it("should throw an exception - findOne", () => {
			// Arange
			jest.spyOn(branchsService, "findOne").mockRejectedValueOnce(new Error());
			// Assert
			expect(branchsController.findOne(1)).rejects.toThrow();
		});
	});

	describe("create", () => {
		it("should be create one branch", async () => {
			// Act
			const result = await branchsController.create(createBrancheDTO);
			// Assert
			expect(result).toBe(createBrancheDTO);
			expect(branchsService.create).toHaveBeenCalledTimes(1);
			expect(branchsService.create).toHaveBeenCalledWith(createBrancheDTO);
		});
		it("should throw an exception - create", () => {
			// Arange
			jest.spyOn(branchsService, "create").mockRejectedValueOnce(new Error());
			// Assert
			expect(branchsController.create(createBrancheDTO)).rejects.toThrow();
		});
	});

	describe("update", () => {
		it("should updated one customer successsully", async () => {
			// Act
			const result = await branchsController.update(1, updateBrancheDTO);
			// Assert
			expect(result).toBe(updateBrancheDTO);
		});
		it("should throw an exception - update", () => {
			// Arange
			jest.spyOn(branchsService, "update").mockRejectedValueOnce(new Error());
			// Assert
			expect(branchsController.update(1, updateBrancheDTO)).rejects.toThrow();
		});
	});

	describe("delete", () => {
		it("should deleted a branch successfully", async () => {
			// Act
			const result = await branchsController.remove(1);
			// Assert
			expect(result).toBeUndefined();
		});
		it("should throw an exception - delete", () => {
			// Arange
			jest.spyOn(branchsService, "remove").mockRejectedValueOnce(new Error());
			// Assert
			expect(branchsController.remove(1)).rejects.toThrow();
		});
	});
});
