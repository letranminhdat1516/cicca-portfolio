// Single source of truth for the JWT secret. Fails fast if unset so we never
// silently fall back to a publicly-known value (which would allow token forgery).
export function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      'JWT_SECRET must be set to a strong value (>=16 chars). Refusing to start with a weak/default secret.',
    );
  }
  return secret;
}
