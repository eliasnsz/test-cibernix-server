import { PublishContentUseCase } from "./publish-content";
import { InMemoryContentsRepository } from "@/utils/repositories/in-memory/in-memory-contents-repository";
import { InMemoryUsersRepository } from "@/utils/repositories/in-memory/in-memory-users-repository";
import { User } from "@/domain/enterprise/entities/user";

let contentsRepository: InMemoryContentsRepository;
let usersRepository: InMemoryUsersRepository;
let sut: PublishContentUseCase;

const user = new User({
	username: "johndoe",
	email: "johndoe@example.com",
	password: "123456",
});

describe("Publish Content use-case", async () => {
	beforeEach(async () => {
		contentsRepository = new InMemoryContentsRepository();
		usersRepository = new InMemoryUsersRepository();
		await usersRepository.create(user);
		sut = new PublishContentUseCase(contentsRepository, usersRepository);
	});

	it("should be able to publish a new content", async () => {
		const contentData = {
			authorId: user.id,
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
			ownerUsername: user.username,
			status: "published",
			publishedAt: expect.any(Date),
			updatedAt: expect.any(Date),
			deletedAt: null,
		});
		expect(contentsRepository.contents).toHaveLength(1);
	});

	it("should not be able to have slug conflict", async () => {
		await sut.execute({
			authorId: user.id,
			title: "First content",
			body: "Example body",
		});

		const [error, result] = await sut.execute({
			authorId: user.id,
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
