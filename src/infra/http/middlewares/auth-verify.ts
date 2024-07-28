import fastifyPlugin from "fastify-plugin";
import type { FastifyInstance } from "fastify";

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
	app.addHook("preHandler", async (request, reply) => {
		if (!request.headers.authorization) {
			return reply.status(401).send({
				message: "Você precisa estar autenticado para realizar esta ação",
				statusCode: 401,
			});
		}

		try {
			await request.jwtVerify();
		} catch (error) {
			return reply.status(401).send({
				message: "Você precisa estar autenticado para realizar esta ação",
				statusCode: 401,
			});
		}
	});
});
