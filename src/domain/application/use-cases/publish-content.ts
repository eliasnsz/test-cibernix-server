import { Content } from "@/domain/enterprise/entities/content";
import { bad, Fail, nice } from "../errors/bad-nice";
import type { ContentsRepository } from "../repositories/contents-repository";
import { Slug } from "@/domain/enterprise/value-objects/slug";

interface PublishContentRequest {
	title: string;
	body: string;
	authorId: string;
}

export class PublishContentUseCase {
	constructor(private contentsRepository: ContentsRepository) {}

	async execute({ title, body, authorId }: PublishContentRequest) {
		const anotherContentWithSameSlug = await this.contentsRepository.findBySlug(
			Slug.createFromText(title),
		);

		if (anotherContentWithSameSlug) {
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
		});

		await this.contentsRepository.create(content);

		return nice();
	}
}
