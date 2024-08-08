"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";

import type { UserDTOType } from "src/dto/UserDTO";

interface User {
  value: UserDTOType;
  timestamp: string;
}

const AuthButton = () => {
  const [user, setUser] = useState<UserDTOType | null>(null);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (!localUser) {
      return;
    }
    const parseUser: User = JSON.parse(localUser);
    const currentDate = dayjs();
    if (currentDate.diff(parseUser.timestamp, "hour") > 24) {
      localStorage.removeItem("user");
      return;
    }
    setUser(parseUser.value);
  }, []);

  if (!user) {
    return (
      <Link href="/login">
        <span>Login</span>
      </Link>
    );
  }

  return <span>{user.name}</span>;
};

export default AuthButton;
