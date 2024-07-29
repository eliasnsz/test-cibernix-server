import { UpdateUserUseCase } from "@/domain/application/use-cases/update-user";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { container } from "tsyringe";
import z from "zod";
import { auth } from "../../middlewares/auth-verify";

export async function updateUser(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.put("/user", {
			schema: {
				body: z.object({
					description: z.string().optional().default(""),
				}),
			},
			handler: async (request, reply) => {
				const updateUser = container.resolve(UpdateUserUseCase);

				const { description } = request.body;

				const [error, response] = await updateUser.execute({
					description,
					userId: request.user.id,
				});

				if (error) {
					switch (error.code) {
						case "RESOURCE_NOT_FOUND":
							return reply.status(404).send({
								message: error.payload.message,
								statusCode: 404,
							});
					}
				}

				return reply.status(204).send();
			},
		});
}
