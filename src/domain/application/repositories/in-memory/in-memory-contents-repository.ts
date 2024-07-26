import type { Content } from "@/domain/enterprise/entities/content";
import type { ContentsRepository } from "../contents-repository";

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
}
