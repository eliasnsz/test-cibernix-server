import z from "zod";

const envSchema = z.object({
	DATABASE_URL: z.string().url(),
	JWT_SECRET: z.string(),
});

const { data, error } = envSchema.safeParse(process.env);

if (error) {
	console.log(error.format());
	throw new Error("Invalid environment variables.");
}

export const env = data;
