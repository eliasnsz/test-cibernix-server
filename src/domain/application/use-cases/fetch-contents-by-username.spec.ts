import { Content } from "@/domain/enterprise/entities/content";
import { User } from "@/domain/enterprise/entities/user";
import { InMemoryContentsRepository } from "@/utils/repositories/in-memory/in-memory-contents-repository";
import { InMemoryUsersRepository } from "@/utils/repositories/in-memory/in-memory-users-repository";
import { FetchContentsByUsernameUseCase } from "./fetch-contents-by-username";

let contentsRepository: InMemoryContentsRepository;
let usersRepository: InMemoryUsersRepository;
let sut: FetchContentsByUsernameUseCase;

const user = new User({
	username: "johndoe",
	email: "johndoe@example.com",
	password: "123456",
});

describe("Fetch User Content use-case", async () => {
	beforeEach(() => {
		contentsRepository = new InMemoryContentsRepository();
		usersRepository = new InMemoryUsersRepository();
		usersRepository.create(user);

		sut = new FetchContentsByUsernameUseCase(
			contentsRepository,
			usersRepository,
		);
	});

	it("should be able to fetch user content with pagination", async () => {
		for (let i = 0; i < 60; i++) {
			await contentsRepository.create(
				new Content({
					title: `Title ${i}`,
					body: `Body ${i}`,
					authorId: user.id,
					ownerUsername: user.username,
				}),
			);
		}

		const [error, response] = await sut.execute({
			username: user.username,
			page: 2,
			limit: 30,
		});

		expect(error).toBeUndefined();
		expect(response?.contents).toHaveLength(30);
	});

	it("should be able to order user content by recents published_at", async () => {
		for (let i = 0; i < 20; i++) {
			await new Promise((resolve) => setTimeout(resolve, 50));
			await contentsRepository.create(
				new Content({
					title: `Title ${i}`,
					body: `Body ${i}`,
					authorId: user.id,
					ownerUsername: user.username,
					publishedAt: new Date(new Date().getTime() + Math.random() * 10000),
				}),
			);
		}

		const [error, response] = await sut.execute({
			username: user.username,
			page: 1,
		});

		const firstContentPublishedAtInMs =
			response?.contents[0].publishedAt.getTime();
		const lastContentPublishedAtInMs =
			response?.contents[19].publishedAt.getTime() as number;

		expect(error).toBeUndefined();
		expect(firstContentPublishedAtInMs).greaterThan(lastContentPublishedAtInMs);
	});
});
