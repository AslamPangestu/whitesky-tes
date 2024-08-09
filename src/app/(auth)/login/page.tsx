import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

const LoginForm = dynamic(() => import("./_components/LoginForm"));

import styles from "./index.module.css";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

const LoginPage = () => (
  <section className={styles.container}>
    <div>
      <h1>Login</h1>
      <LoginForm />
      <div>
        <Link href="/register">
          <span>Go To Register</span>
        </Link>
      </div>
    </div>
  </section>
);

export default LoginPage;
