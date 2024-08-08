import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

import type { PoolConnection } from "mysql2/promise";

import { JWT_SECRET } from "src/config";
import pool from "src/libs/db";
import UserRepository from "src/repositories/UserRepository";

import type { UserDTOType, JWTPayloadType } from "src/dto/UserDTO";
import type { UserType } from "src/models/UserModel";

export const GET = async () => {
  const headersList = headers();
  const token = headersList.get("Authorization") || "";

  const decoded = jwt.verify(token, JWT_SECRET) as JWTPayloadType;

  const db: PoolConnection = await pool.getConnection();
  const repo: UserRepository = new UserRepository(db);

  const { data, error } = await repo.findByID(decoded.id);
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
  const user: UserDTOType = {
    name: currentUser.name,
    email: currentUser.email,
    phone_number: currentUser.phone_number,
  };

  return NextResponse.json({
    message: "User Profile",
    data: user,
    error: null,
  });
};
