import { User } from "@/domain/enterprise/entities/user";
import { FakeHasher } from "@/utils/cryptography/fake-hasher";
import type { HashComparer } from "../cryptography/hash-comparer";
import type { HashGenerator } from "../cryptography/hash-generator";
import { AuthenticateUserUseCase } from "./authenticate-user";
import { InMemoryUsersRepository } from "@/utils/repositories/in-memory/in-memory-users-repository";

let hashGenerator: HashComparer & HashGenerator;
let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUserUseCase;

describe("Authenticate user use-case", async () => {
	beforeEach(() => {
		hashGenerator = new FakeHasher();
		usersRepository = new InMemoryUsersRepository();
		sut = new AuthenticateUserUseCase(usersRepository, hashGenerator);
	});

	it("should be able to authenticate", async () => {
		await usersRepository.create(
			new User({
				name: "John Doe",
				email: "johndoe@example.com",
				password: await hashGenerator.hash("123456"),
			}),
		);

		const [error, result] = await sut.execute({
			email: "johndoe@example.com",
			password: "123456",
		});

		expect(error).toBeUndefined();
		expect(result).toMatchObject({
			userId: expect.any(String),
		});
	});

	it("should not be able to authenticate with invalid email", async () => {
		await usersRepository.create(
			new User({
				name: "John Doe",
				email: "johndoe@example.com",
				password: "123456",
			}),
		);

		const [error, result] = await sut.execute({
			email: "invalid-email@example.com",
			password: "123456",
		});

		expect(result).toBeUndefined();
		expect(error?.code === "RESOURCE_NOT_FOUND").toBeTruthy();
		expect(error?.payload.message === "Credenciais inválidas").toBeTruthy();
	});

	it("should not be able to authenticate with invalid password", async () => {
		await usersRepository.create(
			new User({
				name: "John Doe",
				email: "johndoe@example.com",
				password: "123456",
			}),
		);

		const [error, result] = await sut.execute({
			email: "johndoe@example.com",
			password: "invalid-password",
		});

		expect(result).toBeUndefined();
		expect(error?.code === "INVALID_PASSWORD").toBeTruthy();
		expect(error?.payload.message === "Credenciais inválidas").toBeTruthy();
	});
});
