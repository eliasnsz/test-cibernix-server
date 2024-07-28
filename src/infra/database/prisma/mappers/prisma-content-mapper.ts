import { Content } from "@/domain/enterprise/entities/content";
import type { Content as PrismaContent } from "@prisma/client";
import type { Prisma } from "@prisma/client";

export class PrismaContentMapper {
	static toDomain(content: PrismaContent): Content {
		return new Content({
			id: content.id,
			title: content.title,
			body: content.body,
			slug: content.slug,
			status: content.status,
			authorId: content.authorId as string,
			ownerUsername: content.ownerUsername,
			publishedAt: content.publishedAt,
			updatedAt: content.updatedAt,
			deletedAt: content.publishedAt ? content.publishedAt : null,
		});
	}

	static toPrisma(content: Content): Prisma.ContentUncheckedCreateInput {
		return {
			id: content.id,
			title: content.title,
			body: content.body,
			slug: content.slug,
			status: content.status,
			authorId: content.authorId,
			ownerUsername: content.ownerUsername,
			publishedAt: content.publishedAt.toISOString(),
			updatedAt: content.updatedAt.toISOString(),
			deletedAt: content.deletedAt ? content.deletedAt.toISOString() : null,
		};
	}
}
