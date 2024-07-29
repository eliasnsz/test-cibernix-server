import { randomUUID } from "node:crypto";
import { Content } from "@/domain/enterprise/entities/content";
import { User } from "@/domain/enterprise/entities/user";
import { InMemoryContentsRepository } from "@/utils/repositories/in-memory/in-memory-contents-repository";
import { InMemoryUsersRepository } from "@/utils/repositories/in-memory/in-memory-users-repository";
import { DeleteContentUseCase } from "./delete-content";

let contentsRepository: InMemoryContentsRepository;
let usersRepository: InMemoryUsersRepository;
let sut: DeleteContentUseCase;

const user = new User({
	username: "johndoe",
	email: "johndoe@example.com",
	password: "123456",
});

describe("Delete Content use-case", async () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		contentsRepository = new InMemoryContentsRepository();
		usersRepository.create(user);

		sut = new DeleteContentUseCase(contentsRepository, usersRepository);
	});

	it("should not be able to delete content that doesn't exists", async () => {
		const [error] = await sut.execute({
			contentId: "not-existent-id",
			userId: randomUUID(),
			authorUsername: "johndoe",
		});

		expect(error?.code === "RESOURCE_NOT_FOUND").toBeTruthy();
		expect(error?.payload.message === "Conteúdo não encontrado").toBeTruthy();
	});

	it("should not be able to delete content that doesn't belong to the user", async () => {
		const anotherUserContent = new Content({
			authorId: randomUUID(),
			title: "Another user content title",
			body: "Another user content body",
		});

		await contentsRepository.create(anotherUserContent);

		const [error] = await sut.execute({
			contentId: anotherUserContent.id,
			userId: randomUUID(),
			authorUsername: "johndoe",
		});

		expect(error?.code === "NOT_ALLOWED").toBeTruthy();
		expect(
			error?.payload.message ===
				"Você não tem permissão para excluir este conteúdo",
		).toBeTruthy();
	});

	it("should be able to delete a content", async () => {
		const content = new Content({
			authorId: randomUUID(),
			title: "Content to delete",
			body: "example body",
		});

		await contentsRepository.create(content);

		const [error, result] = await sut.execute({
			userId: content.authorId,
			contentId: content.id,
			authorUsername: "johndoe",
		});

		const deletedContent = contentsRepository.contents[0];

		expect(error).toBeUndefined();
		expect(result).toBeUndefined();
		expect(deletedContent).toMatchObject({
			status: "deleted",
			deletedAt: expect.any(Date),
		});
	});
});
