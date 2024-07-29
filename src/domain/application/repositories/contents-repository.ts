import type { Content } from "@/domain/enterprise/entities/content";

export interface ContentsRepository {
	create(content: Content): Promise<void>;
	findById(contentId: string): Promise<Content | null>;
	findByAuthorIdAndSlug(
		authorId: string,
		slug: string,
	): Promise<Content | null>;
	fetchByUsername({
		username,
		limit,
		page,
	}: { username: string; page: number; limit: number }): Promise<{
		contents: Content[];
		contentsTotalCount: number;
	}>;
	fetchRecent({ limit, page }: { page: number; limit: number }): Promise<{
		contents: Content[];
		contentsTotalCount: number;
	}>;
	save(content: Content): Promise<void>;
}
