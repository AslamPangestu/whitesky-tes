import dynamic from "next/dynamic";

const ChangePasswordForm = dynamic(
  () => import("./_components/ChangePasswordForm"),
);

import styles from "./index.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "User profile",
};

const ProfilePage = () => {
  return (
    <>
      <section className={styles.formContainer}>
        <h1>Name</h1>
        <span>Phone</span>
        <span>Email</span>
      </section>
      <section>
        <h2>Change Password</h2>
        <ChangePasswordForm />
      </section>
    </>
  );
};

export default ProfilePage;
