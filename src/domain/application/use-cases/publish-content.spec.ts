import { randomUUID } from "node:crypto";
import { InMemoryContentsRepository } from "../repositories/in-memory/in-memory-contents-repository";
import { PublishContentUseCase } from "./publish-content";

let contentsRepository: InMemoryContentsRepository;
let sut: PublishContentUseCase;

describe("Publish Content use-case", async () => {
	beforeEach(() => {
		contentsRepository = new InMemoryContentsRepository();
		sut = new PublishContentUseCase(contentsRepository);
	});

	it("should be able to publish a new content", async () => {
		const contentData = {
			authorId: randomUUID(),
			title: "Example title",
			body: "Example body",
		};

		const [error, result] = await sut.execute(contentData);

		expect(error).toBeUndefined();
		expect(result).toBeUndefined();
		expect(contentsRepository.contents[0]).toMatchObject({
			id: expect.any(String),
			authorId: contentData.authorId,
			slug: "example-title",
			title: contentData.title,
			body: contentData.body,
			status: "published",
			publishedAt: expect.any(Date),
			updatedAt: expect.any(Date),
			deletedAt: null,
		});
		expect(contentsRepository.contents).toHaveLength(1);
	});

	it("should not be able to have slug conflict", async () => {
		await sut.execute({
			authorId: randomUUID(),
			title: "First content",
			body: "Example body",
		});

		const [error, result] = await sut.execute({
			authorId: randomUUID(),
			title: "First content",
			body: "Example body",
		});

		expect(error?.code === "SLUG_CONFLICT").toBeTruthy();
		expect(
			error?.payload.message ===
				"Já existe um conteúdo com esse slug. Por favor, escolha um título diferente",
		).toBeTruthy();
		expect(contentsRepository.contents).toHaveLength(1);
	});
});
