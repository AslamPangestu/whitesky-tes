import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import type { PoolConnection } from "mysql2/promise";

import { JWT_SECRET, ENCRYPT_KEY } from "src/config";
import { LoginDTO } from "src/dto/UserDTO";
import pool from "src/libs/db";
import UserRepository from "src/repositories/UserRepository";

import type { UserDTOType, JWTPayloadType } from "src/dto/UserDTO";
import type { UserType } from "src/models/UserModel";

export const POST = async (request: NextRequest) => {
  const req = await request.json();
  const model = LoginDTO.safeParse(req);
  if (!model.success) {
    return NextResponse.json(
      { message: "Invalid request", data: null, error: model.error },
      { status: 400 },
    );
  }

  const db: PoolConnection = await pool.getConnection();
  const repo: UserRepository = new UserRepository(db);

  const { email, password } = req;

  const { data, error } = await repo.findByEmail(email);
  if (error) {
    return NextResponse.json(
      { message: error.message, data: null, error: error },
      { status: 500 },
    );
  }
  if (!data.length) {
    return NextResponse.json(
      { message: "User not found", data: null, error: null },
      { status: 400 },
    );
  }

  const currentUser: UserType = data[0];

  const hashedPassword: string = crypto
    .pbkdf2Sync(password, ENCRYPT_KEY, 1000, 64, `sha512`)
    .toString(`hex`);
  if (hashedPassword !== currentUser.password) {
    return NextResponse.json(
      { message: "Password does't match", data: null, error: null },
      { status: 401 },
    );
  }

  const user: UserDTOType = {
    name: currentUser.name,
    email: currentUser.email,
    phone_number: currentUser.phone_number,
  };
  const jwtPayload: JWTPayloadType = {
    id: currentUser.id,
    ...user,
  };
  const token: string = jwt.sign(jwtPayload, JWT_SECRET, {
    expiresIn: "1h",
  });
  return NextResponse.json({
    message: "User successfully logged in",
    data: {
      token,
      user,
    },
    error: null,
  });
};
