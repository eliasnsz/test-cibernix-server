import { User } from "@/domain/enterprise/entities/user";
import { InMemoryUsersRepository } from "@/utils/repositories/in-memory/in-memory-users-repository";
import { GetUserUseCase } from "./get-user";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserUseCase;

const user = new User({
	username: "johndoe",
	email: "johndoe@example.com",
	password: "123456",
});

describe("Get Content use-case", async () => {
	beforeEach(async () => {
		usersRepository = new InMemoryUsersRepository();
		await usersRepository.create(user);
		sut = new GetUserUseCase(usersRepository);
	});

	it("should be able to get the user", async () => {
		const [error, response] = await sut.execute({
			username: user.username,
		});

		expect(error).toBeUndefined();
		expect(response?.user).toMatchObject(usersRepository.users[0]);
	});

	it("should not be able to get the user that doensn't exist", async () => {
		const [error, response] = await sut.execute({
			username: "random-name",
		});

		expect(response).toBeUndefined();
		expect(error?.code === "RESOURCE_NOT_FOUND").toBeTruthy();
		expect(error?.payload.message === "Usuário não encontrado").toBeTruthy();
	});
});
