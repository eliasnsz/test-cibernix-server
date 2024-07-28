import { Slug } from "@/domain/enterprise/value-objects/slug";
import { Fail, bad, nice } from "../errors/bad-nice";
import type { ContentsRepository } from "../repositories/contents-repository";

interface UpdateContentRequest {
	contentId: string;
	authorId: string;
	title: string;
	body: string;
}

export class UpdateContentUseCase {
	constructor(private contentsRepository: ContentsRepository) {}

	async execute({ title, body, authorId, contentId }: UpdateContentRequest) {
		const content = await this.contentsRepository.findById(contentId);

		if (!content) {
			return bad(
				Fail.create("RESOURCE_NOT_FOUND", {
					message: "Conteúdo não encontrado",
				}),
			);
		}

		if (authorId !== content.authorId) {
			return bad(
				Fail.create("NOT_ALLOWED", {
					message: "Você não tem permissão para editar este conteúdo",
				}),
			);
		}

		const anotherContentWithSameSlug =
			await this.contentsRepository.findByAuthorIdAndSlug(
				authorId,
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

		content.title = title;
		content.body = body;

		await this.contentsRepository.save(content);

		return nice();
	}
}
