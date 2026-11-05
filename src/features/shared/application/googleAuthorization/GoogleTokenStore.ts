import { chmod, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { Credentials } from "google-auth-library";

export class GoogleTokenStore {
  constructor(private readonly tokenPath: string) {}

  async read(): Promise<Credentials | undefined> {
    try {
      const details = await stat(this.tokenPath);
      if ((details.mode & 0o077) !== 0) {
        throw new Error(
          `Token file permissions are unsafe. Set ${this.tokenPath} ` +
            "to owner-only access.",
        );
      }

      return JSON.parse(await readFile(this.tokenPath, "utf8")) as Credentials;
    } catch (error) {
      if (
        typeof error === "object" && error !== null && "code" in error &&
        error.code === "ENOENT"
      ) {
        return undefined;
      }

      throw error;
    }
  }

  async write(token: Credentials): Promise<void> {
    await mkdir(dirname(this.tokenPath), { recursive: true, mode: 0o700 });
    await writeFile(this.tokenPath, JSON.stringify(token, null, 2), {
      mode: 0o600,
    });
    await chmod(this.tokenPath, 0o600);
  }
}
