import { randomBytes, createCipheriv, createHash } from "crypto";

function encryptToken(token: string, key: string): string {
  const iv = randomBytes(16);
  const cipherKey = createHash("sha256").update(key).digest();
  const cipher = createCipheriv("aes-256-cbc", cipherKey, iv);
  const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  return Buffer.from(`${iv.toString("base64")}::${encrypted.toString("base64")}`).toString("base64");
}

const token = process.argv[2];
const key = process.argv[3];

if (!token || !key) {
  console.error("Verwendung: npm run encrypt:instagram <TOKEN> <SCHLUESSEL>");
  process.exit(1);
}

const encrypted = encryptToken(token, key);
console.log("\nVerschlüsselter Token:");
console.log(encrypted);
console.log("\nFüge ihn in server/api/instagram.config.php ein:");
console.log(`  'access_token_encrypted' => '${encrypted}',`);
console.log(`  'token_key' => '${key}',`);
