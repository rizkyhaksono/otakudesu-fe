"use client";

import React from "react";
import Navbar from "./navbar";
import Footer from "./footer";

export default function BaseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div>
        <Navbar />
        {children}
        <Footer />
      </div>
    </>
  );
}
