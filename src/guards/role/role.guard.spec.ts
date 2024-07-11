import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../../utils/enums/role.enum";
import { RoleGuard } from "./role.guard";

describe("RoleGuard", () => {
	let roleGuard: RoleGuard;
	let reflector: Reflector;

	beforeEach(() => {
		reflector = new Reflector();
		roleGuard = new RoleGuard(reflector);
	});

	it("should allow access when user has matching role", async () => {
		const mockContext = createMockExecutionContext(Role.Admin);

		jest
			.spyOn(reflector, "getAllAndOverride")
			.mockReturnValueOnce([Role.Admin]);

		const canActivate = await roleGuard.canActivate(mockContext);

		expect(canActivate).toBe(true);
	});

	it("should allow access when no roles are defined", async () => {
		const mockContext = createMockExecutionContext(Role.User);

		jest.spyOn(reflector, "getAllAndOverride").mockReturnValueOnce(null);

		const canActivate = await roleGuard.canActivate(mockContext);

		expect(canActivate).toBe(true);
	});

	it("should deny access when user does not have matching role", async () => {
		const mockContext = createMockExecutionContext(Role.User);

		jest
			.spyOn(reflector, "getAllAndOverride")
			.mockReturnValueOnce([Role.Admin]);

		const canActivate = await roleGuard.canActivate(mockContext);

		expect(canActivate).toBe(false);
	});

	function createMockExecutionContext(userRole: Role): ExecutionContext {
		const mockRequest = {
			user: { role: userRole }
		};

		return {
			switchToHttp: () => ({
				getRequest: () => mockRequest
			}),
			getHandler: () => {},
			getClass: () => {}
		} as ExecutionContext;
	}
});
