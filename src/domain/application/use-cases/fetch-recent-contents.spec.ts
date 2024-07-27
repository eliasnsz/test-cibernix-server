import { InMemoryContentsRepository } from "@/utils/repositories/in-memory/in-memory-contents-repository";
import { FetchRecentContentsUseCase } from "./fetch-recent-contents";
import { Content } from "@/domain/enterprise/entities/content";
import { randomUUID } from "node:crypto";

let contentsRepository: InMemoryContentsRepository;
let sut: FetchRecentContentsUseCase;

describe("Fetch recent Content use-case", async () => {
	beforeEach(() => {
		contentsRepository = new InMemoryContentsRepository();
		sut = new FetchRecentContentsUseCase(contentsRepository);
	});

	it("should be able to fetch content with pagination", async () => {
		for (let i = 0; i < 60; i++) {
			await contentsRepository.create(
				new Content({
					title: `Title ${i}`,
					body: `Body ${i}`,
					authorId: randomUUID(),
				}),
			);
		}

		const [error, response] = await sut.execute({
			page: 2,
			limit: 30,
		});

		expect(error).toBeUndefined();
		expect(response.contents).toHaveLength(30);
	});

	it("should be able to order by recents published_at", async () => {
		for (let i = 0; i < 20; i++) {
			await new Promise((resolve) => setTimeout(resolve, 50));
			await contentsRepository.create(
				new Content({
					title: `Title ${i}`,
					body: `Body ${i}`,
					authorId: randomUUID(),
					publishedAt: new Date(new Date().getTime() + Math.random() * 10000),
				}),
			);
		}

		const [error, response] = await sut.execute({
			page: 1,
		});

		const firstContentPublishedAtInMs =
			response.contents[0].publishedAt.getTime();
		const lastContentPublishedAtInMs =
			response.contents[19].publishedAt.getTime();

		expect(error).toBeUndefined();
		expect(firstContentPublishedAtInMs).greaterThan(lastContentPublishedAtInMs);
	});
});
