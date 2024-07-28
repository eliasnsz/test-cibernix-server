import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { container } from "tsyringe";
import z from "zod";
import { ContentsPresenter } from "../../presenters/contents-presenter";
import { GetContentUseCase } from "@/domain/application/use-cases/get-content";

export async function getContent(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().route({
		method: "GET",
		url: "/contents/:username/:slug",
		schema: {
			params: z.object({
				username: z.string(),
				slug: z.string(),
			}),
		},
		handler: async (request, reply) => {
			const fetchRecentContent = container.resolve(GetContentUseCase);

			const { username, slug } = request.params;

			const [error, response] = await fetchRecentContent.execute({
				username,
				slug,
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

			const content = ContentsPresenter.toHTTPWithBody(response.content);

			return reply.status(200).send(content);
		},
	});
}
