import type { ContentsRepository } from "@/domain/application/repositories/contents-repository";
import type { Content } from "@/domain/enterprise/entities/content";

export class InMemoryContentsRepository implements ContentsRepository {
	public contents: Content[] = [];

	async create(content: Content) {
		this.contents.push(content);
	}

	async findById(contentId: string) {
		return (
			this.contents.find(
				(content) => content.id === contentId && content.status === "published",
			) ?? null
		);
	}

	async findByAuthorIdAndSlug(authorId: string, slug: string) {
		return (
			this.contents.find(
				(content) =>
					content.slug === slug &&
					content.authorId === authorId &&
					content.status === "published",
			) ?? null
		);
	}

	async save(content: Content) {
		const contentIndex = this.contents.findIndex(
			(item) => item.id === content.id,
		);

		this.contents[contentIndex] = content;
	}

	async fetchRecent({ limit, page }: { page: number; limit: number }) {
		const [start, end] = [limit * (page - 1), limit * page];

		const publishedContents = this.contents.filter(
			(content) => content.status === "published",
		);

		const orderedContent = publishedContents.sort((a, b) =>
			a.publishedAt.getTime() < b.publishedAt.getTime() ? 1 : -1,
		);

		const contents = orderedContent.slice(start, end);

		return { contents, contentsTotalCount: publishedContents.length };
	}

	async fetchByUsername({
		username,
		limit,
		page,
	}: { username: string; page: number; limit: number }) {
		const [start, end] = [limit * (page - 1), limit * page];

		const publishedContents = this.contents.filter(
			(content) =>
				content.status === "published" && content.ownerUsername === username,
		);

		const orderedContent = publishedContents.sort((a, b) =>
			a.publishedAt.getTime() < b.publishedAt.getTime() ? 1 : -1,
		);

		const contents = orderedContent.slice(start, end);

		return { contents, contentsTotalCount: publishedContents.length };
	}
}
