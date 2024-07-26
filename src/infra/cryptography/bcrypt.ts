import type { HashComparer } from "@/domain/application/cryptography/hash-comparer";
import type { HashGenerator } from "@/domain/application/cryptography/hash-generator";
import bcrypt from "bcryptjs";

export class BCryptHasher implements HashGenerator, HashComparer {
	private SALT = 6;

	async hash(plain: string) {
		return await bcrypt.hash(plain, this.SALT);
	}
	async compare(plain: string, hash: string) {
		return await bcrypt.compare(plain, hash);
	}
}
