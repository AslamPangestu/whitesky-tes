"use client";

import { FormEvent } from "react";
import dynamic from "next/dynamic";
import useSWRMutation from "swr/mutation";

const Input = dynamic(() => import("src/components/Input"));
const Button = dynamic(() => import("src/components/Button"));
import { Post } from "src/utils/service";

import type { PostRequest } from "src/utils/service";

import styles from "../index.module.css";

const RegisterForm = () => {
  const { data, trigger, error, isMutating } = useSWRMutation(
    "/auth/register",
    Post,
  );

  const _onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const request: PostRequest = {
      payload: {
        name: formData.get("name"),
        phone_number: formData.get("phone_number"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirm_password: formData.get("confirm_password"),
      },
    };
    await trigger(request);
    console.log("DATA", data);
    console.log("ERROR", error);
  };

  return (
    <form className={styles.formContainer} onSubmit={_onSubmit}>
      <Input label="Name" name="name" />
      <Input label="Phone Number" name="phone_number" />
      <Input label="Email" name="email" type="email" />
      <Input label="Password" name="password" />
      <Input label="Confirm Password" name="confirm_password" />
      {isMutating ? <>Loading</> : <Button label="Register" type="submit" />}
    </form>
  );
};

export default RegisterForm;
