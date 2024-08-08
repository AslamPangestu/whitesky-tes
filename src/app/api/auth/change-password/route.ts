import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";

import type { NextRequest } from "next/server";

import { ENCRYPT_KEY } from "src/config";
import { ChangePasswordDTO } from "src/dto/UserDTO";
import { createToken, verifyToken } from "src/libs/auth";
import DBConnection from "src/libs/db";
import UserRepository from "src/repositories/UserRepository";

import type { JWTPayloadType } from "src/dto/UserDTO";
import type { DBResponse } from "src/libs/db";
import type { UserType } from "src/models/UserModel";

export const POST = async (request: NextRequest) => {
  const req = await request.json();
  const model = ChangePasswordDTO.safeParse(req);
  if (!model.success) {
    return NextResponse.json(
      { message: "Invalid request", data: null, error: model.error },
      { status: 400 },
    );
  }

  const headersList = headers();
  const token = headersList.get("Authorization") || "";
  const { data: authData } = verifyToken(token);
  if (!authData) {
    return;
  }

  const { db, error: errorDB }: DBResponse = await DBConnection();
  if (!db) {
    return NextResponse.json(
      { message: errorDB.message, data: null, error: errorDB },
      { status: 500 },
    );
  }
  const repo: UserRepository = new UserRepository(db);

  const { new_password, old_password } = model.data;

  const { data: userData, error: userError } = await repo.findByID(
    authData?.id,
  );
  if (userError) {
    db.release();
    return NextResponse.json(
      { message: userError.message, data: null, error: userError },
      { status: 500 },
    );
  }

  const currentUser: UserType = userData[0];

  const oldPasswordHashed: string = crypto
    .pbkdf2Sync(old_password, ENCRYPT_KEY, 1000, 64, `sha512`)
    .toString(`hex`);
  if (oldPasswordHashed !== currentUser.password) {
    db.release();
    return NextResponse.json(
      { message: "Password does't match", data: null, error: null },
      { status: 401 },
    );
  }

  const newPasswordHashed: string = crypto
    .pbkdf2Sync(new_password, ENCRYPT_KEY, 1000, 64, `sha512`)
    .toString(`hex`);
  const { error } = await repo.updatePassword(authData?.id, newPasswordHashed);
  if (error) {
    db.release();
    return NextResponse.json(
      { message: error.message, data: null, error: error },
      { status: 500 },
    );
  }

  db.release();
  const jwtPayload: JWTPayloadType = {
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    phone_number: currentUser.phone_number,
  };
  const newToken: string = createToken(jwtPayload);
  return NextResponse.json({
    message: "User successfully registered",
    data: {
      token: newToken,
    },
    error: null,
  });
};
