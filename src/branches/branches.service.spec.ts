import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Status } from "../utils/enums/active.enum";
import { BranchesService } from "./branches.service";
import { CreateBranchDto } from "./dto/create-branch.dto";
import { UpdateBranchDto } from "./dto/update-branch.dto";
import { BranchEntity } from "./entities/branch.entity";

const branchesEntityList: BranchEntity[] = [
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

describe("BranchesService", () => {
	let branchService: BranchesService;
	let brancheRepository: Repository<BranchEntity>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BranchesService,
				{
					provide: getRepositoryToken(BranchEntity),
					useValue: {
						create: jest.fn().mockResolvedValue(createBrancheDTO),
						save: jest.fn().mockResolvedValue(branchesEntityList[0]),
						find: jest.fn().mockResolvedValue(branchesEntityList),
						findAll: jest.fn().mockResolvedValue(branchesEntityList),
						findOne: jest.fn().mockResolvedValue(branchesEntityList[0]),
						update: jest.fn().mockResolvedValue(branchesEntityList[0]),
						delete: jest.fn(),
						exists: jest.fn().mockResolvedValue(true)
					}
				}
			]
		}).compile();

		branchService = module.get<BranchesService>(BranchesService);
		brancheRepository = module.get(getRepositoryToken(BranchEntity));
	});

	describe("Defined", () => {
		it("should be defined", () => {
			expect(branchService).toBeDefined();
			expect(brancheRepository).toBeDefined();
		});
	});

	describe("findAll", () => {
		it("should found all branches", async () => {
			// act
			const result = await branchService.findAll();
			// Assert
			expect(result).toBe(branchesEntityList);
			expect(brancheRepository.find).toHaveBeenCalledTimes(1);
		});
		it("should be throw an excepetion - findAll", () => {
			// Arrange
			jest.spyOn(brancheRepository, "find").mockRejectedValueOnce(new Error());
			// Assert
			expect(branchService.findAll()).rejects.toThrow();
		});
	});
	describe("findOne", () => {
		it("should found one branch", async () => {
			// Act
			const result = await branchService.findOne(1);
			// Assert
			expect(result).toBe(branchesEntityList[0]);
		});
		it("should be throw an excepetion - ", () => {
			// Arrange
			jest
				.spyOn(brancheRepository, "findOne")
				.mockRejectedValueOnce(new Error());
			// Assert
			expect(branchService.findOne(1)).rejects.toThrow();
		});
	});

	describe("Create", () => {
		it("should be created one branch", async () => {
			// Act
			const result = await branchService.create(createBrancheDTO);
			console.info(result);
			// Assert
			expect(result).toBe(branchesEntityList[0]);
			expect(brancheRepository.save).toHaveBeenCalledTimes(1);
		});
		it("should be throw an excepetion - create", () => {
			// Arrange
			jest.spyOn(brancheRepository, "save").mockRejectedValueOnce(new Error());
			// Assert
			expect(branchService.create(createBrancheDTO)).rejects.toThrow();
		});
	});

	describe("Update", () => {
		it("should updated one branch", async () => {
			// Act
			const result = await branchService.update(1, updateBrancheDTO);
			// Assert
			expect(result).toEqual(branchesEntityList[0]);
			expect(updateBrancheDTO.description).toBeDefined();
		});
		it("should be throw an excepetion - Update", () => {
			// Arrange
			jest
				.spyOn(brancheRepository, "update")
				.mockRejectedValueOnce(new Error());
			// Assert
			expect(branchService.update(2, updateBrancheDTO)).rejects.toThrow();
		});
	});

	describe("delete", () => {
		it("should be delete one branch", async () => {
			// Act
			const result = await branchService.remove(1);
			// Assert
			expect(result).toBe(true);
		});
	});

	describe("exists", () => {
		it("shoud be not exists branch", async () => {
			// Arrange
			jest.spyOn(brancheRepository, "exists").mockResolvedValueOnce(false);
			// Assert
			try {
				await branchService.exists(branchesEntityList[0].id);
				fail("Expected NotFoundException to be throw");
			} catch (error) {
				expect(error).toBeInstanceOf(NotFoundException);
				expect(error.message).toBe(
					`A filial com o id ${branchesEntityList[0].id} não existe`
				);
			}
		});
	});
});
