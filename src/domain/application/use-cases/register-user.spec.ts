import { FakeHasher } from "@/utils/cryptography/fake-hasher";
import type { HashGenerator } from "../cryptography/hash-generator";
import { RegisterUserUseCase } from "./register-user";
import { InMemoryUsersRepository } from "@/utils/repositories/in-memory/in-memory-users-repository";

let hashGenerator: HashGenerator;
let usersRepository: InMemoryUsersRepository;
let sut: RegisterUserUseCase;

describe("Register user use-case", async () => {
	beforeEach(() => {
		hashGenerator = new FakeHasher();
		usersRepository = new InMemoryUsersRepository();
		sut = new RegisterUserUseCase(usersRepository, hashGenerator);
	});

	it("should be able to register a new user", async () => {
		const data = {
			username: "JohnDoe",
			email: "johndoe@example.com",
			password: "123456",
		};

		const [error, result] = await sut.execute(data);

		expect(error).toBeUndefined();
		expect(result).toBeUndefined();
		expect(usersRepository.users).toHaveLength(1);
		expect(usersRepository.users[0]).toMatchObject({
			username: data.username,
			email: data.email,
		});
	});

	it("should not be able to register an user with existent email", async () => {
		const userData = {
			username: "JohnDoe",
			email: "johndoe@example.com",
			password: "123456",
		};

		await sut.execute(userData);

		const anotherUserData = {
			username: "AnotherUserWithSameEmail",
			email: "johndoe@example.com",
			password: "123456",
		};

		const [error] = await sut.execute(anotherUserData);

		expect(error?.code === "EMAIL_ALREADY_IN_USE").toBeTruthy();
		expect(
			error?.payload.message === "Este email já está sendo utilizado",
		).toBeTruthy();
		expect(usersRepository.users).toHaveLength(1);
	});

	it("should not be able to register an user with existent username", async () => {
		const userData = {
			username: "johndoe",
			email: "johndoe@example.com",
			password: "123456",
		};

		await sut.execute(userData);

		const anotherUserData = {
			username: "johndoe",
			email: "anotherEmail@example.com",
			password: "123456",
		};

		const [error, r] = await sut.execute(anotherUserData);

		expect(error?.code === "USERNAME_ALREADY_IN_USE").toBeTruthy();
		expect(
			error?.payload.message === "Este nome de usuário já está sendo utilizado",
		).toBeTruthy();
		expect(usersRepository.users).toHaveLength(1);
	});

	it("should be able to hash the password correctly", async () => {
		const data = {
			username: "JohnDoe",
			email: "johndoe@example.com",
			password: "123456",
		};

		const [error] = await sut.execute(data);

		const user = usersRepository.users[0];

		expect(error).toBeUndefined;
		expect(user.password).not.equals(data.password);
	});
});
