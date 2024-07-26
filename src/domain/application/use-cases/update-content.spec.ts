import { Content } from "@/domain/enterprise/entities/content";
import { randomUUID } from "node:crypto";
import { UpdateContentUseCase } from "./update-content";
import { InMemoryContentsRepository } from "@/utils/repositories/in-memory/in-memory-contents-repository";

let contentsRepository: InMemoryContentsRepository;
let sut: UpdateContentUseCase;

describe("Update Content use-case", async () => {
	beforeEach(() => {
		contentsRepository = new InMemoryContentsRepository();
		sut = new UpdateContentUseCase(contentsRepository);
	});

	it("should not be able to update content that doesn't exists", async () => {
		const [error] = await sut.execute({
			contentId: "not-existent-id",
			authorId: randomUUID(),
			title: "Example title",
			body: "Example body",
		});

		expect(contentsRepository.contents).toHaveLength(0);
		expect(error?.code === "RESOURCE_NOT_FOUND").toBeTruthy();
		expect(error?.payload.message === "Conteúdo não encontrado").toBeTruthy();
	});

	it("should not be able to update content that doesn't belong to the user", async () => {
		const anotherUserContent = new Content({
			authorId: randomUUID(),
			title: "Another user content title",
			body: "Another user content body",
		});

		await contentsRepository.create(anotherUserContent);

		const [error] = await sut.execute({
			contentId: anotherUserContent.id,
			authorId: randomUUID(),
			title: "Example title",
			body: "Example body",
		});

		expect(error?.code === "NOT_ALLOWED").toBeTruthy();
		expect(
			error?.payload.message ===
				"Você não tem permissão para editar este conteúdo",
		).toBeTruthy();
	});

	it("should be able to update a content", async () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date().getTime());

		const content = new Content({
			authorId: randomUUID(),
			title: "Example title",
			body: "Example body",
		});

		await contentsRepository.create(content);

		vi.setSystemTime(new Date().getTime() + 100000);
		const [error, result] = await sut.execute({
			title: "Edited title",
			body: "edited body",
			authorId: content.authorId,
			contentId: content.id,
		});

		const editedContent = contentsRepository.contents[0];

		expect(error).toBeUndefined();
		expect(result).toBeUndefined();
		expect(editedContent.publishedAt).not.toBe(editedContent.updatedAt);
		expect(editedContent).toMatchObject({
			id: content.id,
			slug: "edited-title",
			title: "Edited title",
			body: "edited body",
			authorId: content.authorId,
		});
		expect(contentsRepository.contents).toHaveLength(1);
		vi.useRealTimers();
	});

	it("should not be able to have slug conflict on title update", async () => {
		await contentsRepository.create(
			new Content({
				authorId: randomUUID(),
				title: "Example title",
				body: "Example body",
			}),
		);

		const contentToEdit = new Content({
			authorId: randomUUID(),
			title: "Content to edit",
			body: "Another example body",
		});

		await contentsRepository.create(contentToEdit);

		const [error, result] = await sut.execute({
			contentId: contentToEdit.id,
			authorId: contentToEdit.authorId,
			title: "Example title",
			body: "Another example body",
		});

		expect(error?.code === "SLUG_CONFLICT").toBeTruthy();
	});
});
