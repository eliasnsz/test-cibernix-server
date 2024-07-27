import { Fail, bad, nice } from "../errors/bad-nice";
import type { ContentsRepository } from "../repositories/contents-repository";

interface FetchRecentContentsRequest {
	page: number;
	limit?: number;
}

export class FetchRecentContentsUseCase {
	constructor(private contentsRepository: ContentsRepository) {}

	async execute({ page, limit = 30 }: FetchRecentContentsRequest) {
		const contents = await this.contentsRepository.fetchRecent({ page, limit });

		return nice({ contents });
	}
}
