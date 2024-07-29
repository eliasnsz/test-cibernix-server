import { FetchRecentContentsUseCase } from "@/domain/application/use-cases/fetch-recent-contents";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { container } from "tsyringe";
import z from "zod";
import { ContentsPresenter } from "../../presenters/contents-presenter";
import { FetchContentsByUsernameUseCase } from "@/domain/application/use-cases/fetch-contents-by-username";

export async function fetchUserContent(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().route({
		method: "GET",
		url: "/contents/:username",
		schema: {
			params: z.object({
				username: z.string(),
			}),
			querystring: z.object({
				page: z.coerce.number().min(0).optional(),
				limit: z.coerce.number().min(0).optional(),
			}),
		},
		handler: async (request, reply) => {
			const fetchUserContent = container.resolve(
				FetchContentsByUsernameUseCase,
			);

			const { username } = request.params;
			const { limit = 30, page = 1 } = request.query;

			const [error, response] = await fetchUserContent.execute({
				username,
				page,
				limit,
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

			const contents = response.contents.map(ContentsPresenter.toHTTP);

			return reply.status(200).send({
				pagination: response.pagination,
				contents,
			});
		},
	});
}
