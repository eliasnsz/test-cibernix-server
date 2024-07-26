import "reflect-metadata";
import { User } from "@/domain/enterprise/entities/user";
import type { UsersRepository } from "../repositories/users-repository";
import { bad, Fail, nice } from "../errors/bad-nice";
import type { HashGenerator } from "../cryptography/hash-generator";
import { inject, injectable } from "tsyringe";

interface RegisterUserRequest {
	name: string;
	email: string;
	password: string;
}

@injectable()
export class RegisterUserUseCase {
	constructor(
		@inject("UsersRepository") private usersRepository: UsersRepository,
		@inject("HashGenerator") private hashGenerator: HashGenerator,
	) {}

	async execute({ name, email, password }: RegisterUserRequest) {
		const userWithSameEmailAlreadyExists =
			await this.usersRepository.findByEmail(email);

		if (userWithSameEmailAlreadyExists) {
			return bad(
				Fail.create("EMAIL_ALREADY_IN_USE", {
					message: "Este email já está sendo utilizado",
				}),
			);
		}

		const encryptedPassword = await this.hashGenerator.hash(password);

		const user = new User({ name, email, password: encryptedPassword });

		await this.usersRepository.create(user);

		return nice();
	}
}
