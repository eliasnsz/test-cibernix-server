import "reflect-metadata";
import type { User } from "@/domain/enterprise/entities/user";
import { inject, injectable } from "tsyringe";
import { Fail, bad, nice } from "../errors/bad-nice";
import type { UsersRepository } from "../repositories/users-repository";

interface GetUserProfileRequest {
	authorId: string;
}

type Profile = Omit<User, "password">;

@injectable()
export class GetUserProfileUseCase {
	constructor(
		@inject("UsersRepository")
		private usersRepository: UsersRepository,
	) {}

	async execute({ authorId }: GetUserProfileRequest) {
		const user = await this.usersRepository.findById(authorId);

		if (!user) {
			return bad(
				Fail.create("RESOURCE_NOT_FOUND", {
					message: "Usuário não encotrado",
				}),
			);
		}

		const profile: Profile = {
			id: user.id,
			email: user.email,
			username: user.username,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};

		return nice({ profile });
	}
}
