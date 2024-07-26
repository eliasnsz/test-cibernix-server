import "reflect-metadata";
import { BCryptHasher } from "@/infra/cryptography/bcrypt";
import { PrismaUsersRepository } from "@/infra/database/prisma/repositories/prisma-users-repository";
import { container } from "tsyringe";

container.register("UsersRepository", PrismaUsersRepository);
container.register("HashGenerator", BCryptHasher);
container.register("HashComparer", BCryptHasher);
