import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { bad, Fail, nice } from "../errors/bad-nice";
import type { ContentsRepository } from "../repositories/contents-repository";
import type { UsersRepository } from "../repositories/users-repository";

interface GetContentRequest {
	slug: string;
	username: string;
}

@injectable()
export class GetContentUseCase {
	constructor(
		@inject("ContentsRepository")
		private contentsRepository: ContentsRepository,
		@inject("UsersRepository")
		private usersRepository: UsersRepository,
	) {}

	async execute({ slug, username }: GetContentRequest) {
		const user = await this.usersRepository.findByUsername(username);

		if (!user) {
			return bad(
				Fail.create("RESOURCE_NOT_FOUND", {
					message: "Usuário não encotrado",
				}),
			);
		}

		const content = await this.contentsRepository.findByAuthorIdAndSlug(
			user.id,
			slug,
		);

		if (!content) {
			return bad(
				Fail.create("RESOURCE_NOT_FOUND", {
					message: "Publicação não encotrada",
				}),
			);
		}

		return nice({ content });
	}
}
