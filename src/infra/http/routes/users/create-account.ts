import { RegisterUserUseCase } from "@/domain/application/use-cases/register-user";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { container } from "tsyringe";
import { z } from "zod";

export async function createAccount(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().route({
		method: "POST",
		url: "/users",
		schema: {
			body: z.object({
				name: z.string().min(6),
				email: z.string().email(),
				password: z.string().min(6),
			}),
		},
		handler: async (request, reply) => {
			const createAccountUseCase = container.resolve(RegisterUserUseCase);

			const { name, email, password } = request.body;

			const [error] = await createAccountUseCase.execute({
				name,
				email,
				password,
			});

			switch (error?.code) {
				case "EMAIL_ALREADY_IN_USE":
					return reply.status(409).send({
						message: error.payload.message,
						statusCode: 409,
					});
			}

			return "hello";
		},
	});
}
