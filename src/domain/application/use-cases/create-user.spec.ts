import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { CreateUserUseCase } from "./create-user";

let usersRepository: InMemoryUsersRepository;
let sut: CreateUserUseCase;

describe("Create user use-case", async () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new CreateUserUseCase(usersRepository);
	});

	it("should be able to create a new user", async () => {
		const data = {
			name: "John Doe",
			email: "johndoe@example.com",
		};

		await sut.execute(data);

		expect(usersRepository.users).toHaveLength(1);
		expect(usersRepository.users[0]).toMatchObject(data);
	});

	it("should not be able to create an user with existent email", async () => {
		const userData = {
			name: "John Doe",
			email: "johndoe@example.com",
		};

		await sut.execute(userData);

		const anotherUserData = {
			name: "Another User With Same Email",
			email: "johndoe@example.com",
		};

		await expect(sut.execute(anotherUserData)).rejects.toMatchObject({
			message: "Este email já está sendo utilizado",
		});
		expect(usersRepository.users).toHaveLength(1);
	});
});
