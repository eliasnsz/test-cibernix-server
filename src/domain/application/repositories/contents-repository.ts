import type { Content } from "@/domain/enterprise/entities/content";

export interface ContentsRepository {
	create(content: Content): Promise<void>;
	findById(contentId: string): Promise<Content | null>;
	findBySlug(slug: string): Promise<Content | null>;
	fetchRecent({
		limit,
		page,
	}: { page: number; limit: number }): Promise<Content[]>;
	save(content: Content): Promise<void>;
}
