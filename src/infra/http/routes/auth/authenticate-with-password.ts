import { AuthenticateUserUseCase } from "@/domain/application/use-cases/authenticate-user";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { container } from "tsyringe";
import z from "zod";

export async function authenticateWithPassword(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().route({
		method: "POST",
		url: "/sessions",
		schema: {
			body: z.object({
				email: z.string().email(),
				password: z.string(),
			}),
			response: {
				200: z.object({
					access_token: z.string(),
				}),
				400: z.object({
					message: z.string(),
					statusCode: z.number(),
				}),
			},
		},
		handler: async (request, reply) => {
			const authenticateWithPassword = container.resolve(
				AuthenticateUserUseCase,
			);

			const { email, password } = request.body;

			const [error, result] = await authenticateWithPassword.execute({
				email,
				password,
			});

			if (error) {
				switch (error.code) {
					case "RESOURCE_NOT_FOUND":
						return reply.status(400).send({
							message: error.payload.message,
							statusCode: 400,
						});

					case "INVALID_PASSWORD":
						return reply.status(400).send({
							message: error.payload.message,
							statusCode: 400,
						});
				}
			}

			const access_token = await reply.jwtSign(
				{ id: result.userId },
				{ expiresIn: "7d" },
			);

			return reply.status(200).send({
				access_token,
			});
		},
	});
}
