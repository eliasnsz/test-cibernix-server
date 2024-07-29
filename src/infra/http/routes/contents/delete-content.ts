import { DeleteContentUseCase } from "@/domain/application/use-cases/delete-content";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { container } from "tsyringe";
import z from "zod";
import { auth } from "../../middlewares/auth-verify";

export async function deleteContent(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.delete("/contents/:username/:contentId", {
			schema: {
				params: z.object({
					username: z.string(),
					contentId: z.string().uuid(),
				}),
			},
			handler: async (request, reply) => {
				const deleteContent = container.resolve(DeleteContentUseCase);

				const { contentId, username } = request.params;

				const [error] = await deleteContent.execute({
					contentId,
					authorUsername: username,
					userId: request.user.id,
				});

				if (error) {
					switch (error.code) {
						case "RESOURCE_NOT_FOUND":
							return reply.status(404).send({
								message: error.payload.message,
								statusCode: 404,
							});

						case "NOT_ALLOWED":
							return reply.status(403).send({
								message: error.payload.message,
								statusCode: 403,
							});
					}
				}

				return reply.status(204).send();
			},
		});
}
