import { Content } from "@/domain/enterprise/entities/content";
import { bad, Fail, nice } from "../errors/bad-nice";
import type { ContentsRepository } from "../repositories/contents-repository";
import { Slug } from "@/domain/enterprise/value-objects/slug";
import type { UsersRepository } from "../repositories/users-repository";

interface PublishContentRequest {
	title: string;
	body: string;
	authorId: string;
}

export class PublishContentUseCase {
	constructor(
		private contentsRepository: ContentsRepository,
		private usersRepository: UsersRepository,
	) {}

	async execute({ title, body, authorId }: PublishContentRequest) {
		const user = await this.usersRepository.findById(authorId);

		if (!user) {
			return bad(
				Fail.create("RESOURCE_NOT_FOUND", {
					message: "Usuário não encotrado",
				}),
			);
		}

		const anotherContentWithSameSlug = await this.contentsRepository.findBySlug(
			Slug.createFromText(title),
		);

		if (
			anotherContentWithSameSlug &&
			anotherContentWithSameSlug.authorId === authorId
		) {
			return bad(
				Fail.create("SLUG_CONFLICT", {
					message:
						"Já existe um conteúdo com esse slug. Por favor, escolha um título diferente",
				}),
			);
		}

		const content = new Content({
			title,
			body,
			authorId,
			ownerUsername: user.username,
		});

		await this.contentsRepository.create(content);

		return nice();
	}
}
