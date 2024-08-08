"use client";

import { FormEvent } from "react";
import dynamic from "next/dynamic";
import useSWRMutation from "swr/mutation";

const Input = dynamic(() => import("src/components/Input"));
const Button = dynamic(() => import("src/components/Button"));
import { Post } from "src/utils/service";

import type { PostRequest } from "src/utils/service";

import styles from "../index.module.css";

const ChangePasswordForm = () => {
  const { data, trigger, error, isMutating } = useSWRMutation(
    "/auth/change-password",
    Post,
  );

  const _onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const request: PostRequest = {
      payload: {
        old_password: formData.get("old_password"),
        new_password: formData.get("new_password"),
        confirm_password: formData.get("confirm_password"),
      },
    };
    await trigger(request);
    console.log("DATA", data);
    console.log("ERROR", error);
  };

  return (
    <form className={styles.formContainer} onSubmit={_onSubmit}>
      <div>
        <Input label="Old Password" name="old_password" />
        <Input label="New Password" name="new_password" />
        <Input label="Confirm Password" name="confirm_password" />
      </div>
      {isMutating ? (
        <>Loading</>
      ) : (
        <Button label="Change Password" type="submit" />
      )}
    </form>
  );
};

export default ChangePasswordForm;
