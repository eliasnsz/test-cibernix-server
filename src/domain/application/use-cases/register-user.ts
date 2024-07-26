import { User } from "@/domain/enterprise/entities/user";
import type { UsersRepository } from "../repositories/users-repository";
import { bad, Fail, nice } from "../errors/bad-nice";

interface RegisterUserRequest {
	name: string;
	email: string;
}

export class RegisterUserUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({ name, email }: RegisterUserRequest) {
		const user = new User({ name, email });

		const userWithSameEmailAlreadyExists =
			await this.usersRepository.findByEmail(email);

		if (userWithSameEmailAlreadyExists) {
			return bad(
				Fail.create("EMAIL_ALREADY_IN_USE", {
					message: "Este email já está sendo utilizado",
				}),
			);
		}

		await this.usersRepository.create(user);

		return nice();
	}
}
