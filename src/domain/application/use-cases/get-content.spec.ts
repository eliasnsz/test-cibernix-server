import { randomUUID } from "node:crypto";
import { Content } from "@/domain/enterprise/entities/content";
import { User } from "@/domain/enterprise/entities/user";
import { InMemoryContentsRepository } from "@/utils/repositories/in-memory/in-memory-contents-repository";
import { InMemoryUsersRepository } from "@/utils/repositories/in-memory/in-memory-users-repository";
import { GetContentUseCase } from "./get-content";

let contentsRepository: InMemoryContentsRepository;
let usersRepository: InMemoryUsersRepository;
let sut: GetContentUseCase;

const user = new User({
	username: "johndoe",
	email: "johndoe@example.com",
	password: "123456",
});

describe("Get Content use-case", async () => {
	beforeEach(async () => {
		contentsRepository = new InMemoryContentsRepository();
		usersRepository = new InMemoryUsersRepository();
		await usersRepository.create(user);
		sut = new GetContentUseCase(contentsRepository, usersRepository);
	});

	it("should be able to get a content", async () => {
		await contentsRepository.create(
			new Content({
				authorId: user.id,
				title: "Example Title",
				body: "example body",
			}),
		);

		const [error, response] = await sut.execute({
			slug: "example-title",
			username: user.username,
		});

		expect(error).toBeUndefined();
		expect(response?.content).toMatchObject({
			title: "Example Title",
			slug: "example-title",
			body: "example body",
			authorId: user.id,
		});
	});

	it("should not be able to get a content from user that doesn't exist", async () => {
		await contentsRepository.create(
			new Content({
				authorId: randomUUID(),
				title: "Example Title",
				body: "example body",
			}),
		);

		const [error, response] = await sut.execute({
			slug: "example-title",
			username: "inexistentUsername",
		});

		expect(response).toBeUndefined();
		expect(error?.code === "RESOURCE_NOT_FOUND").toBeTruthy();
		expect(error?.payload.message === "Usuário não encotrado").toBeTruthy();
	});

	it("should not be able to get a content that doesn't exist", async () => {
		await contentsRepository.create(
			new Content({
				authorId: user.id,
				title: "Example Title",
				body: "example body",
			}),
		);

		const [error, response] = await sut.execute({
			slug: "not-existent-slug",
			username: user.username,
		});

		expect(response).toBeUndefined();
		expect(error?.code === "RESOURCE_NOT_FOUND").toBeTruthy();
		expect(error?.payload.message === "Publicação não encotrada").toBeTruthy();
	});
});
