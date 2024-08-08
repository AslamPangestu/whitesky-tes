import { Metadata } from "next";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";

import { verifyToken } from "src/libs/auth";
import DBConnection from "src/libs/db";
import UserRepository from "src/repositories/UserRepository";

import type { DBResponse } from "src/libs/db";

import type { UserType } from "src/models/UserModel";

const ChangePasswordForm = dynamic(
  () => import("./_components/ChangePasswordForm"),
);

import styles from "./index.module.css";

export const metadata: Metadata = {
  title: "Profile",
  description: "User profile",
};

const getData = async (): Promise<UserType> => {
  const cookieStore = cookies();

  const tokenCookies = cookieStore.get("token");
  const token = tokenCookies?.value || "";
  const { data: dataAuth, error: errorAuth } = verifyToken(token);
  if (!dataAuth) {
    throw new Error(errorAuth);
  }

  const { db, error: errorDB }: DBResponse = await DBConnection();
  if (!db) {
    throw new Error(errorDB);
  }

  const repo: UserRepository = new UserRepository(db);
  const { data, error } = await repo.findByID(dataAuth.id);
  if (error) {
    db.release();
    throw new Error(errorDB);
  }
  if (!data.length) {
    db.release();
    throw new Error("User not found");
  }

  db.release();
  return data[0];
};

const ProfilePage = async () => {
  const data: UserType = await getData();
  return (
    <>
      <section className={styles.formContainer}>
        <h1>{data.name}</h1>
        <span>{data.phone_number}</span>
        <span>{data.email}</span>
      </section>
      <section>
        <h2>Change Password</h2>
        <ChangePasswordForm />
      </section>
    </>
  );
};

export default ProfilePage;
