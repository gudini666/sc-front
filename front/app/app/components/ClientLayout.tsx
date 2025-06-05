"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import Header from "./Header";
import Footer from "./Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
} 