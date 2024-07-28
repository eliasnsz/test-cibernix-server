import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { bad, Fail, nice } from "../errors/bad-nice";
import type { ContentsRepository } from "../repositories/contents-repository";

interface FetchRecentContentsRequest {
	page: number;
	limit?: number;
}

@injectable()
export class FetchRecentContentsUseCase {
	constructor(
		@inject("ContentsRepository")
		private contentsRepository: ContentsRepository,
	) {}

	async execute({ page, limit = 30 }: FetchRecentContentsRequest) {
		const { contents, contentsTotalCount } =
			await this.contentsRepository.fetchRecent({
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
