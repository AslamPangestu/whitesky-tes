"use client";

import { FormEvent } from "react";

import styles from "../index.module.css";

const LoginForm = () => {
  const _onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(event);
  };

  return (
    <form className={styles.formContainer} onSubmit={_onSubmit}>
      <input name="email" />
      <input name="password" />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
