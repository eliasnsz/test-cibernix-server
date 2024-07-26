import { randomUUID } from "node:crypto";
import { Content } from "@/domain/enterprise/entities/content";
import { InMemoryContentsRepository } from "../repositories/in-memory/in-memory-contents-repository";
import { DeleteContentUseCase } from "./delete-content";

let contentsRepository: InMemoryContentsRepository;
let sut: DeleteContentUseCase;

describe("Delete Content use-case", async () => {
	beforeEach(() => {
		contentsRepository = new InMemoryContentsRepository();
		sut = new DeleteContentUseCase(contentsRepository);
	});

	it("should not be able to delete content that doesn't exists", async () => {
		const [error] = await sut.execute({
			contentId: "not-existent-id",
			authorId: randomUUID(),
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
			authorId: randomUUID(),
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
			authorId: content.authorId,
			contentId: content.id,
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
