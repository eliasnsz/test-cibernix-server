import "reflect-metadata";
import { Fail, bad, nice } from "../errors/bad-nice";
import { inject, injectable } from "tsyringe";
import type { UsersRepository } from "../repositories/users-repository";

interface UpdateUserRequest {
	userId: string;
	description: string;
}

@injectable()
export class UpdateUserUseCase {
	constructor(
		@inject("UsersRepository")
		private usersRepository: UsersRepository,
	) {}

	async execute({ userId, description }: UpdateUserRequest) {
		const user = await this.usersRepository.findById(userId);

		if (!user) {
			return bad(
				Fail.create("RESOURCE_NOT_FOUND", {
					message: "Usuário não encontrado",
				}),
			);
		}

		user.description = description;

		await this.usersRepository.save(user);

		return nice();
	}
}
