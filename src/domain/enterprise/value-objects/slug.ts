export class Slug {
	static createFromText(value: string): string {
		return value
			.toLowerCase()
			.replace(/[^\w\s-]/g, "")
			.replace(/[-\s]+/g, "-")
			.replace(/^-+|-+$/g, "");
	}
}
