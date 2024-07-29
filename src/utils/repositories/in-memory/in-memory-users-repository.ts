import type { UsersRepository } from "@/domain/application/repositories/users-repository";
import type { User } from "@/domain/enterprise/entities/user";

export class InMemoryUsersRepository implements UsersRepository {
	public users: User[] = [];

	async create(user: User) {
		this.users.push(user);
	}

	async findById(userId: string) {
		return this.users.find((user) => user.id === userId) ?? null;
	}

	async findByEmail(email: string) {
		return this.users.find((user) => user.email === email) ?? null;
	}

	async findByUsername(username: string) {
		return this.users.find((user) => user.username === username) ?? null;
	}

	async save(user: User) {
		const userIndex = this.users.findIndex((item) => item.id === user.id);

		this.users[userIndex] = user;
	}
}
