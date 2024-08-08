"use client";

import { FormEvent } from "react";
import dynamic from "next/dynamic";
import useSWRMutation from "swr/mutation";

const Input = dynamic(() => import("src/components/Input"));
const Button = dynamic(() => import("src/components/Button"));
import { Post } from "src/utils/service";

import type { PostRequest } from "src/utils/service";

import styles from "../index.module.css";

const LoginForm = () => {
  const { data, trigger, error, isMutating } = useSWRMutation(
    "/auth/login",
    Post,
  );

  const _onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const request: PostRequest = {
      payload: {
        email: formData.get("email"),
        password: formData.get("password"),
      },
    };
    await trigger(request);
    console.log("DATA", data);
    console.log("ERROR", error);
  };

  return (
    <form className={styles.formContainer} onSubmit={_onSubmit}>
      <Input label="Email" name="email" type="email" />
      <Input label="Password" name="password" />
      {isMutating ? <>Loading</> : <Button label="Login" type="submit" />}
    </form>
  );
};

export default LoginForm;
