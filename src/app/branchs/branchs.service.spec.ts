import { BranchsService } from "@branchs/branchs.service";
import { CreateBranchDto } from "@branchs/dto/create-branch.dto";
import { UpdateBranchDto } from "@branchs/dto/update-branch.dto";
import { BranchEntity } from "@branchs/entities/branch.entity";
import { Status } from "@enums/active.enum";
import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

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

describe("BranchsService", () => {
	let branchService: BranchsService;
	let brancheRepository: Repository<BranchEntity>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BranchsService,
				{
					provide: getRepositoryToken(BranchEntity),
					useValue: {
						create: jest.fn().mockResolvedValue(createBrancheDTO),
						save: jest.fn().mockResolvedValue(branchsEntityList[0]),
						find: jest.fn().mockResolvedValue(branchsEntityList),
						findAll: jest.fn().mockResolvedValue(branchsEntityList),
						findOne: jest.fn().mockResolvedValue(branchsEntityList[0]),
						update: jest.fn().mockResolvedValue(branchsEntityList[0]),
						delete: jest.fn(),
						exists: jest.fn().mockResolvedValue(true)
					}
				}
			]
		}).compile();

		branchService = module.get<BranchsService>(BranchsService);
		brancheRepository = module.get(getRepositoryToken(BranchEntity));
	});

	describe("Defined", () => {
		it("should be defined", () => {
			expect(branchService).toBeDefined();
			expect(brancheRepository).toBeDefined();
		});
	});

	describe("findAll", () => {
		it("should found all branchs", async () => {
			const result = await branchService.findAll();
			expect(result).toBe(branchsEntityList);
			expect(brancheRepository.find).toHaveBeenCalledTimes(1);
		});
		it("should be throw an excepetion - findAll", () => {
			jest.spyOn(brancheRepository, "find").mockRejectedValueOnce(new Error());
			expect(branchService.findAll()).rejects.toThrow();
		});
	});

	describe("findOne", () => {
		it("should found one branch", async () => {
			const result = await branchService.findOne(1);
			expect(result).toBe(branchsEntityList[0]);
		});
		it("should be throw an excepetion - ", () => {
			jest
				.spyOn(brancheRepository, "findOne")
				.mockRejectedValueOnce(new Error());
			expect(branchService.findOne(1)).rejects.toThrow();
		});
	});

	describe("Create", () => {
		it("should be created one branch", async () => {
			const result = await branchService.create(createBrancheDTO);
			expect(result).toBe(branchsEntityList[0]);
			expect(brancheRepository.save).toHaveBeenCalledTimes(1);
		});
		it("should be throw an excepetion - create", () => {
			jest.spyOn(brancheRepository, "save").mockRejectedValueOnce(new Error());
			expect(branchService.create(createBrancheDTO)).rejects.toThrow();
		});
	});

	describe("Update", () => {
		it("should updated one branch", async () => {
			const result = await branchService.update(1, updateBrancheDTO);
			expect(result).toEqual(branchsEntityList[0]);
			expect(updateBrancheDTO.description).toBeDefined();
		});
		it("should be throw an excepetion - Update", () => {
			jest
				.spyOn(brancheRepository, "update")
				.mockRejectedValueOnce(new Error());
			expect(branchService.update(2, updateBrancheDTO)).rejects.toThrow();
		});
	});

	describe("delete", () => {
		it("should be delete one branch", async () => {
			const result = await branchService.remove(1);
			expect(result).toBe(true);
		});
	});

	describe("exists", () => {
		it("shoud be not exists branch", async () => {
			jest.spyOn(brancheRepository, "exists").mockResolvedValueOnce(false);
			try {
				await branchService.exists(branchsEntityList[0].id);
				fail("Expected NotFoundException to be throw");
			} catch (error) {
				expect(error).toBeInstanceOf(NotFoundException);
				expect(error.message).toBe(
					`A filial com o id ${branchsEntityList[0].id} não existe`
				);
			}
		});
	});
});
