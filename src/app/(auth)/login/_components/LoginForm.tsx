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

const LoginForm = () => {
  const router = useRouter();
  const { trigger, isMutating } = useSWRMutation("/auth/login", Post);

  const _onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const request: PostRequest = {
      payload: {
        email: formData.get("email"),
        password: formData.get("password"),
      },
    };

    const response: Response = await trigger(request);
    if (!response.status) {
      toast.error("Failed to login");
      return;
    }
    const storage = new Storage("user");
    storage.set(response.data.user);
    Cookie.set("token", response.data.token, { expires: 1 });
    toast.success(`Welcome back, ${response.data.user.name}`);
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <form className={styles.formContainer} onSubmit={_onSubmit}>
      <Input label="Email" name="email" type="email" />
      <Input label="Password" name="password" type="password" />
      <Button label="Login" type="submit" loading={isMutating} />
    </form>
  );
};

export default LoginForm;
