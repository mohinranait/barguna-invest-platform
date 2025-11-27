import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  className?: string;
  children?: React.ReactNode;
};
const UserContainer = ({ className, children }: Props) => {
  return (
    <div className={cn(" max-w-4xl px-2 lg:px-0 mx-auto", className)}>
      {children}
    </div>
  );
};

export default UserContainer;
