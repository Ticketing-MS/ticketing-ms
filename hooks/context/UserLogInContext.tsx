/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { User } from "lib/db/models";
import HttpGateway from "lib/middlewares/web/HttpGateway";
import { createContext, useContext, useEffect, useState } from "react";

interface UserLogInContextType {
  userLogIn?: User;
  changeUserLogIn: () => void;
}

const UserLogInContext = createContext<UserLogInContextType>({
  userLogIn: undefined,
  changeUserLogIn: () => {},
});

export const useUserLogIn = () => useContext(UserLogInContext);

export const UserLogInProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userLogIn, setUserLogIn] = useState<User>();

  const fetchUser = async () => {
    const { status, data } = await HttpGateway.secureHttpGet("/api/auth/me");
    const user: User = data.data;
    setUserLogIn(user);

    if (status === 200) {
      sessionStorage.setItem("user", JSON.stringify(user));
    }
  };

  const changeUserLogIn = async () => {
    const userData = sessionStorage.getItem("user");
    if (!userData) {
      fetchUser();
    } else {
      setUserLogIn(JSON.parse(userData));
    }
  };

  useEffect(() => {
    changeUserLogIn();
  }, []);

  return (
    <UserLogInContext.Provider value={{ userLogIn, changeUserLogIn }}>
      {children}
    </UserLogInContext.Provider>
  );
};
