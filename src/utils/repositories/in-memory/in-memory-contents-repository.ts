import type { ContentsRepository } from "@/domain/application/repositories/contents-repository";
import type { Content } from "@/domain/enterprise/entities/content";

export class InMemoryContentsRepository implements ContentsRepository {
	public contents: Content[] = [];

	async create(content: Content) {
		this.contents.push(content);
	}

	async findById(contentId: string) {
		return this.contents.find((content) => content.id === contentId) ?? null;
	}

	async findBySlug(slug: string) {
		return this.contents.find((content) => content.slug === slug) ?? null;
	}

	async save(content: Content) {
		const contentIndex = this.contents.findIndex(
			(item) => item.id === content.id,
		);

		this.contents[contentIndex] = content;
	}

	async fetchRecent({ limit, page }: { page: number; limit: number }) {
		const [start, end] = [limit * (page - 1), limit * page];
		const orderedContent = this.contents.sort((a, b) =>
			a.publishedAt.getTime() < b.publishedAt.getTime() ? 1 : -1,
		);

		const contents = orderedContent.slice(start, end);

		return contents;
	}
}
