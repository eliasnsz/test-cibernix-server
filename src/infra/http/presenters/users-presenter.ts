import type { User } from "@/domain/enterprise/entities/user";

export class UsersPresenter {
	static toHTTP(content: User) {
		return {
			id: content.id,
			email: content.email,
			username: content.username,
			description: content.description,
			created_at: content.createdAt,
			updated_at: content.updatedAt,
		};
	}
}
