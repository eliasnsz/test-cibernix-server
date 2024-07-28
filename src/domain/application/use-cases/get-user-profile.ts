import "reflect-metadata";
import type { User } from "@/domain/enterprise/entities/user";
import { inject, injectable } from "tsyringe";
import { Fail, bad, nice } from "../errors/bad-nice";
import type { UsersRepository } from "../repositories/users-repository";

interface GetUserProfileRequest {
	username: string;
}

type Profile = Omit<User, "password">;

@injectable()
export class GetUserProfileUseCase {
	constructor(
		@inject("UsersRepository")
		private usersRepository: UsersRepository,
	) {}

	async execute({ username }: GetUserProfileRequest) {
		const user = await this.usersRepository.findByUsername(username);

		if (!user) {
			return bad(
				Fail.create("RESOURCE_NOT_FOUND", {
					message: "Usuário não encontrado",
				}),
			);
		}

		return nice({ user });
	}
}
