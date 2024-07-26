import { Fail, bad, nice } from "../errors/bad-nice";
import type { ContentsRepository } from "../repositories/contents-repository";

interface DeleteContentRequest {
	contentId: string;
	authorId: string;
}

export class DeleteContentUseCase {
	constructor(private contentsRepository: ContentsRepository) {}

	async execute({ authorId, contentId }: DeleteContentRequest) {
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
					message: "Você não tem permissão para excluir este conteúdo",
				}),
			);
		}

		content.delete();

		await this.contentsRepository.save(content);

		return nice();
	}
}
