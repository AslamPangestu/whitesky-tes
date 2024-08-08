import { NextResponse } from "next/server";
import crypto from "crypto";

import type { NextRequest } from "next/server";

import { ENCRYPT_KEY } from "src/config";
import { CreateUserDTO } from "src/dto/UserDTO";
import { createToken } from "src/libs/auth";
import DBConnection from "src/libs/db";
import UserRepository from "src/repositories/UserRepository";

import type {
  CreateUserDTOType,
  UserDTOType,
  JWTPayloadType,
} from "src/dto/UserDTO";
import type { DBResponse } from "src/libs/db";

export const POST = async (request: NextRequest) => {
  const req = await request.json();
  const model = CreateUserDTO.safeParse(req);
  if (!model.success) {
    return NextResponse.json(
      { message: "Invalid request", data: null, error: model.error },
      { status: 400 },
    );
  }

  const { db, error: dbError }: DBResponse = await DBConnection();
  if (!db) {
    return NextResponse.json(
      { message: dbError.message, data: null, error: dbError },
      { status: 500 },
    );
  }
  const repo: UserRepository = new UserRepository(db);

  const { name, email, phone_number, password } = model.data;

  const { data: userData, error: userError } = await repo.findByEmail(email);
  if (userError) {
    db.release();
    return NextResponse.json(
      { message: userError.message, data: null, error: userError },
      { status: 500 },
    );
  }
  if (userData.length) {
    db.release();
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
    db.release();
    return NextResponse.json(
      { message: error.message, data: null, error: error },
      { status: 500 },
    );
  }

  db.release();
  const user: UserDTOType = { name, email, phone_number };
  const jwtPayload: JWTPayloadType = {
    id: data,
    ...user,
  };
  const token: string = createToken(jwtPayload);
  return NextResponse.json({
    message: "User successfully registered",
    data: {
      token,
      user,
    },
    error: null,
  });
};
