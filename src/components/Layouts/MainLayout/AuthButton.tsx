"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import { toast } from "react-hot-toast";

import DropdownButton from "src/components/DropdownButton";
import Storage from "src/libs/storage";

import type { UserDTOType } from "src/dto/UserDTO";

const AuthButton = () => {
  const router = useRouter();

  const [user, setUser] = useState<UserDTOType | null>(null);

  useEffect(() => {
    const storage = new Storage("user");
    const user: UserDTOType = storage.get();
    if (user) {
      setUser(user);
    }
  }, []);

  const _goToProfile = () => {
    router.push("/profile");
  };

  const _onLogout = () => {
    const storage = new Storage("user");
    storage.remove();
    Cookie.remove("token");
    toast.success("Goddbye!");
    location.reload();
  };

  if (!user) {
    return (
      <Link href="/login">
        <span>Login</span>
      </Link>
    );
  }

  return (
    <DropdownButton
      label={user.name}
      items={[
        { key: "profile", label: "Profile", onClick: _goToProfile },
        { key: "logout", label: "Logout", onClick: _onLogout },
      ]}
    />
  );
};

export default AuthButton;
