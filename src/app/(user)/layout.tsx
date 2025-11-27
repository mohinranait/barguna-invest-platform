import UserHeader from "@/components/shared/UserHeader";
import React from "react";

type Props = {
  children: React.ReactNode;
};
const UserLayout = ({ children }: Props) => {
  return (
    <div className=" min-h-screen ">
      <div className="">
        {/* <UserHeader /> */}
        <div className="">{children}</div>
      </div>
    </div>
  );
};

export default UserLayout;
