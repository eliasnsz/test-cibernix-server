import { FetchRecentContentsUseCase } from "@/domain/application/use-cases/fetch-recent-contents";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { container } from "tsyringe";
import z from "zod";
import { ContentsPresenter } from "../../presenters/contents-presenter";

export async function fetchRecent(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().route({
		method: "GET",
		url: "/contents",
		schema: {
			querystring: z.object({
				page: z.coerce.number().min(1).optional(),
				limit: z.coerce.number().min(0).optional(),
			}),
		},
		handler: async (request, reply) => {
			const fetchRecentContent = container.resolve(FetchRecentContentsUseCase);

			const { limit = 30, page = 1 } = request.query;

			const [error, response] = await fetchRecentContent.execute({
				page,
				limit,
			});

			const contents = response.contents.map(ContentsPresenter.toHTTP);

			return reply.status(200).send(contents);
		},
	});
}
