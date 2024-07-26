import { Slug } from "./slug";

test("should slugify text successfully", () => {
	const exampleTitle = "Lorem Ipsum @51 /  Title ExamplE-";
	const slugifiedTitle = Slug.createFromText(exampleTitle);

	expect(slugifiedTitle).toEqual("lorem-ipsum-51-title-example");
});
