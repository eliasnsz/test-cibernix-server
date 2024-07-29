import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { container } from "tsyringe";
import { z } from "zod";
import { UsersPresenter } from "../../presenters/users-presenter";
import { GetUserUseCase } from "@/domain/application/use-cases/get-user";

export async function getUser(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get("/users/:username", {
		schema: {
			params: z.object({
				username: z.string(),
			}),
		},
		handler: async (request, reply) => {
			const getUserProfile = container.resolve(GetUserUseCase);

			const { username } = request.params;

			const [error, response] = await getUserProfile.execute({
				username,
			});

			if (error) {
				switch (error?.code) {
					case "RESOURCE_NOT_FOUND":
						return reply.status(404).send({
							message: error.payload.message,
							statusCode: 404,
						});
				}
			}

			const profile = UsersPresenter.toHTTP(response.user);

			return reply.status(200).send(profile);
		},
	});
}
