import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

const LoginForm = dynamic(() => import("./_components/LoginForm"));

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

const LoginPage = () => {
  return (
    <section>
      <div>
        <h1>Login</h1>
        <LoginForm />
        <Link href="/register">
          <span>Register</span>
        </Link>
      </div>
    </section>
  );
};

export default LoginPage;
