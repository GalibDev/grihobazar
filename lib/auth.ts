import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const cookieName = "gb_admin";
const adminEmail = process.env.ADMIN_EMAIL ?? "admin@grihobazar.local";
const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
const authSecret = process.env.AUTH_SECRET ?? "change-this-secret-in-production";

function sign(value: string) {
  return createHmac("sha256", authSecret).update(value).digest("hex");
}

export function verifyCredentials(email: string, password: string) {
  return email === adminEmail && password === adminPassword;
}

export function createAdminToken() {
  const payload = JSON.stringify({ email: adminEmail, exp: Date.now() + 1000 * 60 * 60 * 12 });
  const encoded = Buffer.from(payload).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifyAdminToken(token?: string) {
  if (!token) return false;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;

  const expected = sign(encoded);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as { exp: number };
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  const token = (await cookies()).get(cookieName)?.value;
  return verifyAdminToken(token);
}

export { cookieName };
