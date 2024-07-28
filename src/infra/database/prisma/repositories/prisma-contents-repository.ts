import type { ContentsRepository } from "@/domain/application/repositories/contents-repository";
import type { Content } from "@/domain/enterprise/entities/content";
import { prisma } from "../client";
import { PrismaContentMapper } from "../mappers/prisma-content-mapper";

export class PrismaContentsRepository implements ContentsRepository {
	findBySlug(slug: string): Promise<Content | null> {
		throw new Error("Method not implemented.");
	}
	async create(content: Content) {
		await prisma.content.create({
			data: PrismaContentMapper.toPrisma(content),
		});
	}
	async findById(contentId: string) {
		const content = await prisma.content.findUnique({
			where: { id: contentId },
		});

		if (!content) {
			return null;
		}

		return PrismaContentMapper.toDomain(content);
	}

	async findByAuthorIdAndSlug(authorId: string, slug: string) {
		const content = await prisma.content.findUnique({
			where: {
				slug_authorId: {
					slug,
					authorId: authorId,
				},
			},
		});

		if (!content) {
			return null;
		}

		return PrismaContentMapper.toDomain(content);
	}

	async fetchRecent({ limit, page }: { page: number; limit: number }) {
		const contents = await prisma.content.findMany({
			where: {
				status: "published",
			},
			orderBy: {
				publishedAt: "desc",
			},
			take: limit,
			skip: limit * (page - 1),
		});

		return contents.map(PrismaContentMapper.toDomain);
	}

	async save(content: Content) {
		await prisma.content.update({
			where: {
				id: content.id,
			},
			data: PrismaContentMapper.toPrisma(content),
		});
	}
}
