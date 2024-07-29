import "reflect-metadata";
import { Fail, bad, nice } from "../errors/bad-nice";
import type { ContentsRepository } from "../repositories/contents-repository";
import { inject, injectable } from "tsyringe";
import type { UsersRepository } from "../repositories/users-repository";

interface DeleteContentRequest {
	contentId: string;
	authorUsername: string;
	userId: string;
}

@injectable()
export class DeleteContentUseCase {
	constructor(
		@inject("ContentsRepository")
		private contentsRepository: ContentsRepository,
		@inject("UsersRepository")
		private usersRepository: UsersRepository,
	) {}

	async execute({ userId, contentId, authorUsername }: DeleteContentRequest) {
		const user = await this.usersRepository.findByUsername(authorUsername);

		if (!user) {
			return bad(
				Fail.create("RESOURCE_NOT_FOUND", {
					message: "Usuário não encontrado",
				}),
			);
		}

		const content = await this.contentsRepository.findById(contentId);

		if (!content) {
			return bad(
				Fail.create("RESOURCE_NOT_FOUND", {
					message: "Conteúdo não encontrado",
				}),
			);
		}

		if (userId !== content.authorId) {
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
