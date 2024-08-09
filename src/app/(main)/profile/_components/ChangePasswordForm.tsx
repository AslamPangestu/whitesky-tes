"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { toast } from "react-hot-toast";
import Cookie from "js-cookie";

import Button from "src/components/Button";
import Input from "src/components/Input";
import { Post } from "src/utils/service";

import type { PostRequest, Response } from "src/utils/service";

import styles from "../index.module.css";

const ChangePasswordForm = () => {
  const router = useRouter();
  const { trigger, isMutating } = useSWRMutation("/auth/change-password", Post);

  const _onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const request: PostRequest = {
      token: Cookie.get("token"),
      payload: {
        old_password: formData.get("old_password"),
        new_password: formData.get("new_password"),
        confirm_password: formData.get("confirm_password"),
      },
    };

    const response: Response = await trigger(request);
    if (!response.status) {
      toast.error("Failed to change password");
      return;
    }
    Cookie.set("token", response.data.token, { expires: 1 });
    toast.success("Password changed");
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <form className={styles.formContainer} onSubmit={_onSubmit}>
      <div>
        <Input label="Old Password" name="old_password" type="password" />
        <Input label="New Password" name="new_password" type="password" />
        <Input
          label="Confirm Password"
          name="confirm_password"
          type="password"
        />
      </div>
      <Button label="Change Password" type="submit" loading={isMutating} />
    </form>
  );
};

export default ChangePasswordForm;
