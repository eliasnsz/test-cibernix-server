import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { auth } from "../../middlewares/auth-verify";
import { UsersPresenter } from "../../presenters/users-presenter";
import { GetUserProfileUseCase } from "@/domain/application/use-cases/get-profile";
import { container } from "tsyringe";

export async function getProfile(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get("/user", {
			handler: async (request, reply) => {
				const getUserProfile = container.resolve(GetUserProfileUseCase);

				const [error, response] = await getUserProfile.execute({
					authorId: request.user.id,
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
