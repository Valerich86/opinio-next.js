import React from "react";
import { Metadata } from "next";
import LoginForm from "../components/login-form";
import Link from "next/link";

export const metadata: Metadata = {
  title: "/вход",
};

export default function Login() {
  return (
    <div className="flex flex-col w-screen min-h-screen items-center justify-center bg-[url(/bg-login.jpg)] bg-center md:bg-top-left bg-cover md:bg-size-[130%] bg-no-repeat">
      <div className="dark-container"></div>
      <LoginForm/>
      <div className="rounded-b-md bg-secondary w-[80%] h-[150px] md:w-1/3 z-10 flex justify-center items-center opacity-70">
        <Link href={"/register"} className="w-2/3 h-2/3 rounded-md border border-zinc-100 bg-secondary text-zinc-100 text-center hover:invert flex justify-center items-center">
          Я новый пользователь
        </Link>
      </div>
    </div>
  );
}
