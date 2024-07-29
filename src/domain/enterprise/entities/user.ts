import { randomUUID } from "node:crypto";
import type { Optional } from "../../types/optional";

interface UserProps {
	id: string;
	username: string;
	email: string;
	description: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
}

export class User {
	private props: UserProps;

	get id() {
		return this.props.id;
	}

	get username() {
		return this.props.username;
	}

	get email() {
		return this.props.email;
	}

	get description() {
		return this.props.description;
	}

	set description(value: string) {
		this.props.description = value;
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

	constructor(
		props: Optional<
			UserProps,
			"id" | "createdAt" | "updatedAt" | "description"
		>,
	) {
		this.props = {
			...props,
			id: props.id ?? randomUUID(),
			description: props.description ?? "",
			createdAt: props.createdAt ?? new Date(),
			updatedAt: new Date(),
		};
	}
}
