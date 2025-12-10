"use client";

import { FormEvent, useState } from "react";
import {
  RegistrationFormErrors,
  RegistrationFormData,
} from "../lib/definitions";
import { redirect } from "next/navigation";
import FormError from "./UI/form-error";

export default function RegisterForm() {
  const [form, setForm] = useState<RegistrationFormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<RegistrationFormErrors | undefined>(
    undefined
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors(undefined);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      redirect("/profile");
    } else if (response.status == 406) {
      setErrors((await response.json()).errors);
    } else {
      throw new Error("Ooops!");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`mt-20 py-10 px-5 rounded-t-md bg-primary border border-[#3066BE] shadow-[#3066BE] shadow-2xl w-[80%] md:w-1/3 z-10 flex flex-col gap-5`}
    >
      <h1 className={`font-800 text-center text-2xl text-zinc-800`}>
        Регистрация
      </h1>
      <fieldset>
        <label htmlFor="email" className="italic text-sm">
          Почта
        </label>
        <input
          className="w-full rounded-md border-none p-2 text-sm bg-white placeholder:opacity-90 focus-input"
          id="email"
          type="email"
          name="email"
          value={form.email}
          placeholder="введите адрес электронной почты"
          autoFocus
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <div id="email-error" aria-live="polite" aria-atomic="true">
          {errors?.email &&
            errors.email.map((error: string) => (
              <FormError errorField={error}/>
            ))}
        </div>
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
        <div id="password-error" aria-live="polite" aria-atomic="true">
          {errors?.password &&
            errors.password.map((error: string) => (
              <FormError errorField={error}/>
            ))}
        </div>
      </fieldset>
      <fieldset>
        <label htmlFor="confirmPassword" className="italic text-sm">
          Подтверждение пароля
        </label>
        <input
          className="w-full rounded-md border-none p-2 text-sm bg-white placeholder:opacity-90 focus-input"
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          placeholder="повторите пароль"
          required
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />
        <div id="confirmPassword-error" aria-live="polite" aria-atomic="true">
          {errors?.confirmPassword &&
            errors.confirmPassword.map((error: string) => (
              <FormError errorField={error}/>
            ))}
        </div>
      </fieldset>
      <input
        className="w-full rounded-md bg-accent text-white h-10 hover:opacity-85"
        type="submit"
        value={"Зарегистрироваться"}
      />
    </form>
  );
}
