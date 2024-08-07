import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

const RegisterForm = dynamic(() => import("./_components/RegisterForm"));

export const metadata: Metadata = {
  title: "Register",
  description: "Register new account",
};

const RegisterPage = () => {
  return (
    <section>
      <div>
        <h1>Register</h1>
        <RegisterForm />
        <Link href="/login">
          <span>Login</span>
        </Link>
      </div>
    </section>
  );
};

export default RegisterPage;
