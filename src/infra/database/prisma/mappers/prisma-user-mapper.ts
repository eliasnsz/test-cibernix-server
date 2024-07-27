import { User } from "@/domain/enterprise/entities/user";
import type { User as PrismaUser } from "@prisma/client";
import type { Prisma } from "@prisma/client";

export class PrismaUserMapper {
	static toDomain(user: PrismaUser): User {
		return new User({
			id: user.id,
			username: user.username,
			email: user.email,
			password: user.password,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		});
	}

	static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
		return {
			id: user.id,
			username: user.username,
			email: user.email,
			password: user.password,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}
}
