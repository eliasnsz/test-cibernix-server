import { User } from "@/domain/enterprise/entities/user";
import { FakeEncrypter } from "@/tests/cryptography/fake-encrypter";
import { FakeHasher } from "@/tests/cryptography/fake-hasher";
import type { Encrypter } from "../cryptography/encrypter";
import type { HashComparer } from "../cryptography/hash-comparer";
import type { HashGenerator } from "../cryptography/hash-generator";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { AuthenticateUserUseCase } from "./authenticate-user";

let encrypter: Encrypter;
let hashGenerator: HashComparer & HashGenerator;
let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUserUseCase;

describe("Authenticate user use-case", async () => {
	beforeEach(() => {
		encrypter = new FakeEncrypter();
		hashGenerator = new FakeHasher();
		usersRepository = new InMemoryUsersRepository();
		sut = new AuthenticateUserUseCase(
			usersRepository,
			hashGenerator,
			encrypter,
		);
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
			accessToken: expect.any(String),
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
