import { User } from "@/domain/enterprise/entities/user";
import { InMemoryUsersRepository } from "@/utils/repositories/in-memory/in-memory-users-repository";
import { randomUUID } from "node:crypto";
import { UpdateUserUseCase } from "./update-user";

let usersRepository: InMemoryUsersRepository;
let sut: UpdateUserUseCase;

let user: User;

describe("Update User use-case", async () => {
	beforeEach(async () => {
		usersRepository = new InMemoryUsersRepository();
		usersRepository = new InMemoryUsersRepository();
		user = new User({
			username: "johndoe",
			email: "johndoe@example.com",
			description: "",
			password: "123456",
		});

		await usersRepository.create(user);
		sut = new UpdateUserUseCase(usersRepository);
	});

	it("should not be able to update user that doesn't exists", async () => {
		const [error] = await sut.execute({
			userId: randomUUID(),
			description: "new description",
		});

		expect(usersRepository.users[0].description).toBe("");
		expect(error?.code === "RESOURCE_NOT_FOUND").toBeTruthy();
		expect(error?.payload.message === "Usuário não encontrado").toBeTruthy();
	});

	it("should be able to update a user", async () => {
		const [error, result] = await sut.execute({
			userId: user.id,
			description: "new description",
		});

		const editedUser = usersRepository.users[0];

		expect(error).toBeUndefined();
		expect(result).toBeUndefined();
		expect(editedUser.description).toEqual("new description");
		expect(usersRepository.users).toHaveLength(1);
	});
});
