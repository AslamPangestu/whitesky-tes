import { NextResponse } from "next/server";
import crypto from "crypto";

import type { NextRequest } from "next/server";

import { ENCRYPT_KEY } from "src/config";
import { LoginDTO } from "src/dto/UserDTO";
import { createToken } from "src/libs/auth";
import DBConnection from "src/libs/db";
import UserRepository from "src/repositories/UserRepository";

import type { UserDTOType, JWTPayloadType } from "src/dto/UserDTO";
import type { DBResponse } from "src/libs/db";
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

  const { db, error: dbError }: DBResponse = await DBConnection();
  if (!db) {
    return NextResponse.json(
      { message: dbError.message, data: null, error: dbError },
      { status: 500 },
    );
  }
  const repo: UserRepository = new UserRepository(db);

  const { email, password } = model.data;

  const { data, error } = await repo.findByEmail(email);
  if (error) {
    db.release();
    return NextResponse.json(
      { message: error.message, data: null, error: error },
      { status: 500 },
    );
  }
  if (!data.length) {
    db.release();
    return NextResponse.json(
      { message: "User not found", data: null, error: null },
      { status: 400 },
    );
  }
  db.release();

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
  const token: string = createToken(jwtPayload);
  return NextResponse.json({
    message: "User successfully logged in",
    data: {
      token,
      user,
    },
    error: null,
  });
};
