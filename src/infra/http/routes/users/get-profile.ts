import { GetUserProfileUseCase } from "@/domain/application/use-cases/get-user-profile";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { container } from "tsyringe";
import { z } from "zod";
import { auth } from "../../middlewares/auth-verify";
import { UsersPresenter } from "../../presenters/users-presenter";

export async function getProfile(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get("/users/:username", {
			schema: {
				params: z.object({
					username: z.string(),
				}),
			},
			handler: async (request, reply) => {
				const getUserProfile = container.resolve(GetUserProfileUseCase);

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
