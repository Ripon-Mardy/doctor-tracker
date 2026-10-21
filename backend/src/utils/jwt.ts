import jwt, { type SignOptions } from "jsonwebtoken";

const JWT_EXPIRES_IN: SignOptions["expiresIn"] =
  (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) ?? "1d";

export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_SECRET must be set to a secret of at least 32 characters",
    );
  }

  return secret;
};

export const createAuthToken = (adminId: string): string => {
  return jwt.sign({ sub: adminId }, getJwtSecret(), {
    expiresIn: JWT_EXPIRES_IN,
  });
};
