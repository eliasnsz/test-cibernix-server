import "reflect-metadata";
import { Fail, bad, nice } from "../errors/bad-nice";
import type { UsersRepository } from "../repositories/users-repository";
import type { HashComparer } from "../cryptography/hash-comparer";
import { inject, injectable } from "tsyringe";

interface AuthenticateUserRequest {
	email: string;
	password: string;
}

@injectable()
export class AuthenticateUserUseCase {
	constructor(
		@inject("UsersRepository") private usersRepository: UsersRepository,
		@inject("HashComparer") private hashComparer: HashComparer,
	) {}

	async execute({ email, password }: AuthenticateUserRequest) {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			return bad(
				Fail.create("RESOURCE_NOT_FOUND", {
					message: "Credenciais inválidas",
				}),
			);
		}

		const doesPasswordMatch = await this.hashComparer.compare(
			password,
			user.password,
		);

		if (!doesPasswordMatch) {
			return bad(
				Fail.create("INVALID_PASSWORD", {
					message: "Credenciais inválidas",
				}),
			);
		}

		return nice({
			userId: user.id,
		});
	}
}
