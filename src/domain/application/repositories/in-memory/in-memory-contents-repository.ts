import type { Content } from "@/domain/enterprise/entities/content";
import type { ContentsRepository } from "../contents-repository";

export class InMemoryContentsRepository implements ContentsRepository {
	public contents: Content[] = [];

	async create(content: Content) {
		this.contents.push(content);
	}

	async findBySlug(slug: string) {
		return this.contents.find((content) => content.slug === slug) ?? null;
	}
}
