import { User } from "@/domain/enterprise/entities/user";
import type { HashGenerator } from "../cryptography/hash-generator";
import { Fail, bad, nice } from "../errors/bad-nice";
import type { UsersRepository } from "../repositories/users-repository";
import type { HashComparer } from "../cryptography/hash-comparer";
import type { Encrypter } from "../cryptography/encrypter";

interface AuthenticateUserRequest {
	email: string;
	password: string;
}

export class AuthenticateUserUseCase {
	constructor(
		private usersRepository: UsersRepository,
		private hashComparer: HashComparer,
		private encrypter: Encrypter,
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

		const accessToken = await this.encrypter.encrypt({
			sub: user.id,
		});

		return nice({
			accessToken,
		});
	}
}
