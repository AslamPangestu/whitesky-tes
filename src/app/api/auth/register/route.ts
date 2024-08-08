import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import type { PoolConnection } from "mysql2/promise";

import { JWT_SECRET, ENCRYPT_KEY } from "src/config";
import { CreateUserDTO } from "src/dto/UserDTO";
import pool from "src/libs/db";
import UserRepository from "src/repositories/UserRepository";

import type {
  CreateUserDTOType,
  UserDTOType,
  JWTPayloadType,
} from "src/dto/UserDTO";

export const POST = async (request: NextRequest) => {
  const req = await request.json();
  const model = CreateUserDTO.safeParse(req);
  if (!model.success) {
    return NextResponse.json(
      { message: "Invalid request", data: null, error: model.error },
      { status: 400 },
    );
  }

  const db: PoolConnection = await pool.getConnection();
  const repo: UserRepository = new UserRepository(db);

  const { name, email, phone_number, password } = req;

  const { data: dataUniqueUser, error: errorUniqueUser } =
    await repo.findByEmail(email);
  if (errorUniqueUser) {
    return NextResponse.json(
      { message: errorUniqueUser.message, data: null, error: errorUniqueUser },
      { status: 500 },
    );
  }
  if (dataUniqueUser.length) {
    return NextResponse.json(
      { message: "User already exists", data: null, error: null },
      { status: 400 },
    );
  }

  const hashedPassword: string = crypto
    .pbkdf2Sync(password, ENCRYPT_KEY, 1000, 64, `sha512`)
    .toString(`hex`);

  const payload: CreateUserDTOType = {
    ...model.data,
    password: hashedPassword,
  };
  const { data, error } = await repo.create(payload);
  if (error) {
    return NextResponse.json(
      { message: error.message, data: null, error: error },
      { status: 500 },
    );
  }

  const user: UserDTOType = { name, email, phone_number };
  const jwtPayload: JWTPayloadType = {
    id: data,
    ...user,
  };
  const token: string = jwt.sign(jwtPayload, JWT_SECRET, {
    expiresIn: "1h",
  });
  return NextResponse.json({
    message: "User successfully registered",
    data: {
      token,
      user,
    },
    error: null,
  });
};
