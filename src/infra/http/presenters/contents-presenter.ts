import type { Content } from "@/domain/enterprise/entities/content";

export class ContentsPresenter {
	static toHTTP(content: Content) {
		return {
			id: content.id,
			slug: content.slug,
			title: content.title,
			status: content.status,
			authorId: content.authorId,
			publishedAt: content.publishedAt,
			updatedAt: content.updatedAt,
			deletedAt: content.deletedAt,
		};
	}
}
