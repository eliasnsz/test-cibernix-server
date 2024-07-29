import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { bad, Fail, nice } from "../errors/bad-nice";
import type { ContentsRepository } from "../repositories/contents-repository";
import type { UsersRepository } from "../repositories/users-repository";

interface FetchContentsByUsernameRequest {
	username: string;
	page: number;
	limit?: number;
}

@injectable()
export class FetchContentsByUsernameUseCase {
	constructor(
		@inject("ContentsRepository")
		private contentsRepository: ContentsRepository,
		@inject("UsersRepository")
		private usersRepository: UsersRepository,
	) {}

	async execute({
		username,
		page,
		limit = 30,
	}: FetchContentsByUsernameRequest) {
		const user = await this.usersRepository.findByUsername(username);

		if (!user) {
			return bad(
				Fail.create("RESOURCE_NOT_FOUND", {
					message: "Usuário não encontrado",
				}),
			);
		}

		const { contents, contentsTotalCount } =
			await this.contentsRepository.fetchByUsername({
				username: user.username,
				page: page <= 0 ? 1 : page,
				limit: limit <= 0 ? 1 : limit,
			});

		const firstPage = 1;
		const perPage = limit;
		const lastPage = Math.ceil(contentsTotalCount / limit) || 1;
		const previousPage = page - 1 >= firstPage ? page - 1 : null;
		const nextPage = page + 1 <= lastPage ? page + 1 : null;
		const contentsFound = contents.length;

		const pagination = {
			page,
			perPage,
			firstPage,
			lastPage,
			previousPage,
			nextPage,
			contentsFound,
		};

		return nice({ contents, pagination });
	}
}
