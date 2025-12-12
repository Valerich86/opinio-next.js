"use client";

import { FormEvent, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { SurveyError, User } from "@/src/lib/definitions";
import FormError from "../UI/form-error";

export default function SurveyForm({userId}:{userId:string}) {
  const [error, setError] = useState<SurveyError | undefined>(undefined);
  const [title, setTitle] = useState("");
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const response = await fetch("/api/surveys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userId, title: title }),
    });
    if (response.ok) {
      const newSurveyId:string = (await response.json()).id;
      console.log("до передачи параметров:", newSurveyId)
      router.push(`/newSurvey/${newSurveyId}`);
    } else if (response.status == 406) {
      setError((await response.json()).errors);
      console.log(error)
    } else {
      throw new Error("Ooops!");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`mt-10 rounded-t-md w-[80%] md:w-1/2  flex flex-col gap-5`}
    >
      <input
        className="w-full rounded-md h-10 border-none p-2 text-sm bg-white shadow-[#3066BE] shadow-xl/20 placeholder:opacity-90 focus-input"
        autoFocus
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <FormError errorField={error?.title}/>

      <div className="w-full flex justify-evenly">
        <button onClick={() => router.back()} className="px-5 rounded-md border border-zinc-500 h-10 hover:opacity-70 cursor-pointer">
          Назад
        </button>
        <input
          className="px-5 rounded-md bg-accent text-white h-10 hover:opacity-85 cursor-pointer"
          type="submit"
          value={"Сохранить и продолжить"}
        />
      </div>
    </form>
  );
}
