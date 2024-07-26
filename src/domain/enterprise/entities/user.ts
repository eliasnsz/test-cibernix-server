import { randomUUID } from "node:crypto";
import type { Optional } from "../../types/optional";

interface UserProps {
	id: string;
	name: string;
	email: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
}

export class User {
	private props: UserProps;

	get id() {
		return this.props.id;
	}

	get name() {
		return this.props.name;
	}

	get email() {
		return this.props.email;
	}

	get password() {
		return this.props.password;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	constructor(props: Optional<UserProps, "id" | "createdAt" | "updatedAt">) {
		this.props = {
			...props,
			id: props.id ?? randomUUID(),
			createdAt: props.createdAt ?? new Date(),
			updatedAt: new Date(),
		};
	}
}
