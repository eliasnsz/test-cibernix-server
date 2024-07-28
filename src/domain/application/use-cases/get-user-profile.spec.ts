import { randomUUID } from "node:crypto";
import { User } from "@/domain/enterprise/entities/user";
import { InMemoryUsersRepository } from "@/utils/repositories/in-memory/in-memory-users-repository";
import { GetUserProfileUseCase } from "./get-user-profile";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

const user = new User({
	username: "johndoe",
	email: "johndoe@example.com",
	password: "123456",
});

describe("Get Content use-case", async () => {
	beforeEach(async () => {
		usersRepository = new InMemoryUsersRepository();
		await usersRepository.create(user);
		sut = new GetUserProfileUseCase(usersRepository);
	});

	it("should be able to get the user profile", async () => {
		const [error, response] = await sut.execute({
			authorId: user.id,
		});

		expect(error).toBeUndefined();
		expect(response?.profile.username).toEqual("johndoe");
		expect(response?.profile.email).toEqual("johndoe@example.com");
		expect(response?.profile).not.toHaveProperty("password");
	});

	it("should not be able to get the user profile that doensn't exist", async () => {
		const [error, response] = await sut.execute({
			authorId: randomUUID(),
		});

		expect(response).toBeUndefined();
		expect(error?.code === "RESOURCE_NOT_FOUND").toBeTruthy();
		expect(error?.payload.message === "Usuário não encotrado").toBeTruthy();
	});
});
