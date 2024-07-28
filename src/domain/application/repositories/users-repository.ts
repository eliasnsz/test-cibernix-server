import type { User } from "@/domain/enterprise/entities/user";

export interface UsersRepository {
	create(user: User): Promise<void>;
	findById(userId: string): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
	findByUsername(username: string): Promise<User | null>;
}
