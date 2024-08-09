import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

const RegisterForm = dynamic(() => import("./_components/RegisterForm"));

import styles from "./index.module.css";

export const metadata: Metadata = {
  title: "Register",
  description: "Register new account",
};

const RegisterPage = () => (
  <section className={styles.container}>
    <div>
      <h1>Register</h1>
      <RegisterForm />
      <div>
        <Link href="/login">
          <span>Go To Login</span>
        </Link>
      </div>
    </div>
  </section>
);

export default RegisterPage;
