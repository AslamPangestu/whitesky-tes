"use client";

import { FormEvent } from "react";

import styles from "../index.module.css";

const RegisterForm = () => {
  const _onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(event);
  };

  return (
    <form className={styles.formContainer} onSubmit={_onSubmit}>
      <input name="name" />
      <input name="phone" />
      <input name="email" />
      <input name="password" />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
