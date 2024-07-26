import type { HashComparer } from "@/domain/application/cryptography/hash-comparer";
import type { HashGenerator } from "@/domain/application/cryptography/hash-generator";

export class FakeHasher implements HashGenerator, HashComparer {
	async hash(plain: string) {
		return `${plain}-hashed`;
	}

	async compare(plain: string, hash: string) {
		if (hash === `${plain}-hashed`) {
			return true;
		}
		return false;
	}
}
