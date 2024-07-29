import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { container } from "tsyringe";
import z from "zod";
import { PublishContentUseCase } from "@/domain/application/use-cases/publish-content";
import { auth } from "../../middlewares/auth-verify";
import { UpdateContentUseCase } from "@/domain/application/use-cases/update-content";

export async function updateContent(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.put("/contents/:username/:slug", {
			schema: {
				params: z.object({
					username: z.string(),
					slug: z.string(),
				}),
				body: z.object({
					contentId: z.string().uuid(),
					title: z.string(),
					body: z.string(),
				}),
			},
			handler: async (request, reply) => {
				const updateContent = container.resolve(UpdateContentUseCase);

				const { username, slug } = request.params;
				const { contentId, title, body } = request.body;

				const [error, response] = await updateContent.execute({
					authorId: request.user.id,
					contentId: contentId,
					title,
					body,
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

						case "SLUG_CONFLICT":
							return reply.status(409).send({
								message: error.payload.message,
								statusCode: 409,
							});
					}
				}

				return reply.status(201).send({
					redirect_path: `/${response.content.ownerUsername}/${
						response.content.slug
					}`,
				});
			},
		});
}
