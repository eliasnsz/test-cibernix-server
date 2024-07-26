import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { RegisterUserUseCase } from "./register-user";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUserUseCase;

describe("Register user use-case", async () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new RegisterUserUseCase(usersRepository);
	});

	it("should be able to register a new user", async () => {
		const data = {
			name: "John Doe",
			email: "johndoe@example.com",
		};

		const [error, result] = await sut.execute(data);

		expect(error).toBeUndefined();
		expect(result).toBeUndefined();
		expect(usersRepository.users).toHaveLength(1);
		expect(usersRepository.users[0]).toMatchObject(data);
	});

	it("should not be able to register an user with existent email", async () => {
		const userData = {
			name: "John Doe",
			email: "johndoe@example.com",
		};

		await sut.execute(userData);

		const anotherUserData = {
			name: "Another User With Same Email",
			email: "johndoe@example.com",
		};

		const [error, result] = await sut.execute(anotherUserData);

		expect(error?.code === "EMAIL_ALREADY_IN_USE").toBeTruthy();
		expect(
			error?.payload.message === "Este email já está sendo utilizado",
		).toBeTruthy();
		expect(usersRepository.users).toHaveLength(1);
	});
});
