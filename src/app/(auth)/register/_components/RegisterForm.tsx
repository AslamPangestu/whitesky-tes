"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { toast } from "react-hot-toast";
import Cookie from "js-cookie";

import Button from "src/components/Button";
import Input from "src/components/Input";
import Storage from "src/libs/storage";
import { Post } from "src/utils/service";

import type { PostRequest, Response } from "src/utils/service";

import styles from "../index.module.css";

const RegisterForm = () => {
  const router = useRouter();
  const { trigger, isMutating } = useSWRMutation("/auth/register", Post);

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

    const response: Response = await trigger(request);
    if (!response.status) {
      toast.error("Failed to register");
      return;
    }
    const storage = new Storage("user");
    storage.set(response.data.user);
    Cookie.set("token", response.data.token, { expires: 1 });
    toast.success(`Welcome, ${response.data.user.name}`);
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <form className={styles.formContainer} onSubmit={_onSubmit}>
      <Input label="Name" name="name" />
      <Input label="Phone Number" name="phone_number" />
      <Input label="Email" name="email" type="email" />
      <Input label="Password" name="password" type="password" />
      <Input label="Confirm Password" name="confirm_password" type="password" />
      <Button label="Register" type="submit" loading={isMutating} />
    </form>
  );
};

export default RegisterForm;
