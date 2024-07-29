import fastify from "fastify";
import "./config/container";
import fastifyCors from "@fastify/cors";
import {
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { authenticateWithPassword } from "./routes/auth/authenticate-with-password";
import { createAccount } from "./routes/users/create-account";
import { fetchRecent } from "./routes/contents/fetch-recent";
import { publishNewContent } from "./routes/contents/publish-new";
import { getContent } from "./routes/contents/get-content";
import { getUser } from "./routes/users/get-user";
import { getProfile } from "./routes/users/get-profile";
import { fetchUserContent } from "./routes/contents/fetch-user-content";
import { updateContent } from "./routes/contents/update-content";
import { updateUser } from "./routes/users/update-profile";

export const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
	origin: "*",
});
app.register(require("@fastify/jwt"), {
	secret: "supersecret",
});

app.register(createAccount);
app.register(authenticateWithPassword);
app.register(fetchRecent);
app.register(publishNewContent);
app.register(getContent);
app.register(getUser);
app.register(getProfile);
app.register(fetchUserContent);
app.register(updateContent);
app.register(updateUser);

app
	.listen({
		port: 3333,
		host: "0.0.0.0",
	})
	.then(() => console.log("🚀 Server running on http://localhost:3333/"));
