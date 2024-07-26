import type { Content } from "@/domain/enterprise/entities/content";

export interface ContentsRepository {
	create(content: Content): Promise<void>;
	findBySlug(slug: string): Promise<Content | null>;
}
