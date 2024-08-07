"use client";

import { FormEvent } from "react";

import styles from "../index.module.css";

const ChangePasswordForm = () => {
  const _onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(event);
  };

  return (
    <form className={styles.formContainer} onSubmit={_onSubmit}>
      <div>
        <input name="old_password" />
        <input name="new_password" />
        <input name="confirm_password" />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default ChangePasswordForm;
