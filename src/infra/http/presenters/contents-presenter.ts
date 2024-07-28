import type { Content } from "@/domain/enterprise/entities/content";

export class ContentsPresenter {
	static toHTTP(content: Content) {
		return {
			id: content.id,
			slug: content.slug,
			title: content.title,
			status: content.status,
			author_id: content.authorId,
			owner_username: content.ownerUsername,
			published_at: content.publishedAt,
			updated_at: content.updatedAt,
			deleted_at: content.deletedAt,
		};
	}
}
