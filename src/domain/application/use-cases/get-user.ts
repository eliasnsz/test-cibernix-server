import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { Fail, bad, nice } from "../errors/bad-nice";
import type { UsersRepository } from "../repositories/users-repository";

interface GetUserRequest {
	username: string;
}

@injectable()
export class GetUserUseCase {
	constructor(
		@inject("UsersRepository")
		private usersRepository: UsersRepository,
	) {}

	async execute({ username }: GetUserRequest) {
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
