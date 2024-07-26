import type { UsersRepository } from "@/domain/application/repositories/users-repository";
import type { User } from "@/domain/enterprise/entities/user";
import { prisma } from "../client";
import { PrismaUserMapper } from "../mappers/prisma-user-mapper";

export class PrismaUsersRepository implements UsersRepository {
	async create(user: User) {
		await prisma.user.create({
			data: PrismaUserMapper.toPrisma(user),
		});
	}

	async findByEmail(email: string) {
		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			return null;
		}

		return PrismaUserMapper.toDomain(user);
	}
}
