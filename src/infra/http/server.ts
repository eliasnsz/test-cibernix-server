import fastify from "fastify";
import "./config/container";
import {
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { createAccount } from "./routes/users/create-account";

export const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createAccount);

app
	.listen({
		port: 3333,
		host: "0.0.0.0",
	})
	.then(() => console.log("🚀 Server running on http://localhost:3333/"));
