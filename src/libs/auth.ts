import jwt from "jsonwebtoken";

import { JWT_SECRET } from "src/config";
import type { JWTPayloadType } from "src/dto/UserDTO";

interface VeriyTokenResponse {
  data: JWTPayloadType | null;
  error: any;
}

export const createToken = (payload: JWTPayloadType) => {
  const token: string = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

export const verifyToken = (token: string): VeriyTokenResponse => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayloadType;
    return { data: decoded, error: null };
  } catch (error) {
    console.error("JWT Verification Error", error);
    return { data: null, error };
  }
};
