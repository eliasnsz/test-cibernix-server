import type { User } from "@/domain/enterprise/entities/user";
import type { UsersRepository } from "../users-repository";

export class InMemoryUsersRepository implements UsersRepository {
	public users: User[] = [];

	async create(user: User) {
		this.users.push(user);
	}

	async findByEmail(email: string) {
		return this.users.find((user) => user.email === email) ?? null;
	}
}
