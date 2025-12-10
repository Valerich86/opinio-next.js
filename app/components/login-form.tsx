"use client";

import { FormEvent, useState } from "react";
import { redirect } from "next/navigation";
import { LoginError, LoginFormData } from "../lib/definitions";
import FormError from "./form-error";

export default function LoginForm() {
  const [error, setError] = useState<LoginError | undefined>(undefined);
  const [form, setForm] = useState<LoginFormData>({ email: "", password: "" });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(undefined);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      redirect("/profile");
    } else if (response.status == 406) {
      setError(await response.json());
    } else {
      throw new Error("Ooops!");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`mt-20 py-10 px-5 rounded-t-md bg-primary border-[#3066BE] shadow-[#3066BE] shadow-2xl w-[80%] md:w-1/3 z-10 flex flex-col gap-5`}
    >
      <h1 className={`font-800 text-center text-2xl text-zinc-800`}>Вход</h1>
      <fieldset>
        <label htmlFor="email" className="italic text-sm">
          Почта
        </label>
        <input
          className="w-full rounded-md border-none p-2 text-sm bg-white placeholder:opacity-90 focus-input"
          id="email"
          type="email"
          name="email"
          placeholder="введите адрес электронной почты"
          value={form.email}
          autoFocus
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </fieldset>
      <fieldset>
        <label htmlFor="password" className="italic text-sm">
          Пароль
        </label>
        <input
          className="w-full rounded-md border-none p-2 text-sm bg-white placeholder:opacity-90 focus-input"
          id="password"
          type="password"
          name="password"
          value={form.password}
          placeholder="введите пароль"
          required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </fieldset>

      <FormError errorField={error?.error}/>

      <input
        className="w-full rounded-md bg-accent text-white h-10 hover:opacity-85 cursor-pointer"
        type="submit"
        value={"Войти"}
      />
    </form>
  );
}
