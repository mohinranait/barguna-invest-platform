"use client";
import React, { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};
const withAuth = ({ children }: Props) => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return null;
  }

  return <div>withAuth</div>;
};

export default withAuth;
