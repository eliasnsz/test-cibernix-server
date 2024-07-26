import fastify from "fastify";
import "./config/container";
import {
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { authenticateWithPassword } from "./routes/auth/authenticate-with-password";
import { createAccount } from "./routes/users/create-account";

export const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(require("@fastify/jwt"), {
	secret: "supersecret",
});

app.register(createAccount);
app.register(authenticateWithPassword);

app
	.listen({
		port: 3333,
		host: "0.0.0.0",
	})
	.then(() => console.log("🚀 Server running on http://localhost:3333/"));
