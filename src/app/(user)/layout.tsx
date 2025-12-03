import UserHeader from "@/components/shared/UserHeader";
import UserProvider from "@/providers/UserProvider";
import React from "react";

type Props = {
  children: React.ReactNode;
};
const UserLayout = ({ children }: Props) => {
  return (
    <UserProvider>
      <div className=" min-h-screen ">
        <div className="">
          {/* <UserHeader /> */}
          <div className="">{children}</div>
        </div>
      </div>
    </UserProvider>
  );
};

export default UserLayout;
