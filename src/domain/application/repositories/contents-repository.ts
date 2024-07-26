import type { Content } from "@/domain/enterprise/entities/content";

export interface ContentsRepository {
	create(content: Content): Promise<void>;
	findById(contentId: string): Promise<Content | null>;
	findBySlug(slug: string): Promise<Content | null>;
	save(content: Content): Promise<void>;
}
