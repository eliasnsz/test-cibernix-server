import { FetchRecentContentsUseCase } from "@/domain/application/use-cases/fetch-recent-contents";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { container } from "tsyringe";
import z from "zod";
import { ContentsPresenter } from "../../presenters/contents-presenter";
import { PublishContentUseCase } from "@/domain/application/use-cases/publish-content";
import { auth } from "../../middlewares/auth-verify";

export async function publishNewContent(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.post("/contents", {
			schema: {
				body: z.object({
					title: z.string(),
					body: z.string(),
				}),
			},
			handler: async (request, reply) => {
				const publishNewContent = container.resolve(PublishContentUseCase);

				const { title, body } = request.body;

				const [error, response] = await publishNewContent.execute({
					title,
					body,
					authorId: request.user.id,
				});

				if (error) {
					switch (error.code) {
						case "RESOURCE_NOT_FOUND":
							return reply.status(404).send({
								message: error.payload.message,
								statusCode: 404,
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
