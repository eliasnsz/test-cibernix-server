import type { Optional } from "@/domain/types/optional";
import { randomUUID } from "node:crypto";
import { Slug } from "../value-objects/slug";

type ContentStatus = "published" | "deleted";

interface ContentProps {
	id: string;
	authorId: string;
	title: string;
	slug: string;
	body: string;
	status: ContentStatus;
	publishedAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
}

export class Content {
	private props: ContentProps;

	get id() {
		return this.props.id;
	}

	get slug() {
		return this.props.slug;
	}

	get authorId() {
		return this.props.authorId;
	}

	get title() {
		return this.props.title;
	}

	set title(value: string) {
		this.props.title = value;
		this.props.slug = Slug.createFromText(value);
		this.touch();
	}

	get body() {
		return this.props.body;
	}

	set body(value: string) {
		this.props.body = value;
		this.touch();
	}

	get status() {
		return this.props.status;
	}

	get publishedAt() {
		return this.props.publishedAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get deletedAt() {
		return this.props.deletedAt;
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	delete() {
		this.props.status = "deleted";
		this.props.deletedAt = new Date();
		this.touch();
	}

	constructor(
		props: Optional<
			ContentProps,
			"deletedAt" | "publishedAt" | "updatedAt" | "id" | "slug" | "status"
		>,
	) {
		this.props = {
			id: props.id ?? randomUUID(),
			slug: props.slug ?? Slug.createFromText(props.title),
			authorId: props.authorId,
			status: "published",
			title: props.title,
			body: props.body,
			publishedAt: props.publishedAt ?? new Date(),
			updatedAt: new Date(),
			deletedAt: null,
		};
	}
}
