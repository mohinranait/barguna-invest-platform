import { DollarSign } from "lucide-react";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href={"/"}>
      <div className="text-2xl uppercase font-bold text-primary">
        <span className="bg-primary text-white ">Barguna</span>
        Invest
      </div>
    </Link>
  );
};

export default Logo;
