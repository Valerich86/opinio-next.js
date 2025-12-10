"use client";

import { BiAddToQueue } from "react-icons/bi";
import { FormEvent, useState, useEffect } from "react";
import { QuestionTypes, QuestionDefinitions } from "../../lib/constants";
import { MdDeleteForever } from "react-icons/md";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  reFetch: () => void;
  surveyId: string | undefined;
}

export default function SurveyUpdateModal({
  isOpen,
  closeModal,
  reFetch,
  surveyId,
}: ModalProps) {
  const [error, setError] = useState<String | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!surveyId) return;
    getSurveyData();
  }, [isOpen]);

  async function getSurveyData() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/surveys/${surveyId}`);
      if (res.ok) {
        const { title } = (await res.json()).survey;
        setTitle(title);
      } else {
        console.error("Ошибка получения данных");
      }
    } catch (error) {
      setError("Произошла ошибка. Попробуйте ещё раз.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    closeModal();
    try {
      const response = await fetch(`/api/surveys/${surveyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title }),
      });
    } catch (error) {
      setError("Произошла ошибка. Попробуйте ещё раз.");
    } finally {
      reFetch();
    }
  }

  return (
    <div
      className={`w-screen py-20 pl-2 items-center z-10 absolute -top-10 
      ${isOpen ? "translate-x-0 scale-100" : "-translate-x-full scale-0"} 
      transition-all duration-400`}
    >
      <form
        onSubmit={handleSubmit}
        onReset={closeModal}
        className={`mt-10 rounded-md bg-primary w-[90%] md:w-1/3 flex flex-col gap-5 p-10 shadow-xl/20 shadow-[#3066BE]`}
      >
        <label htmlFor="title" className="italic text-sm">
          Название опроса
        </label>
        <input
          className="w-full rounded-md h-10 border-none p-2 text-sm bg-white placeholder:opacity-90 focus-input"
          id="title"
          autoFocus
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="w-full  md:flex md:flex-row flex-col justify-between items-center">
          <button
            type="reset"
            className="md:px-5 w-full md:w-auto rounded-md border border-zinc-400 h-10 hover:opacity-70 cursor-pointer text-sm"
          >
            Назад
          </button>
          <input
            className="mt-2 md:mt-0 md:px-5 w-full md:w-auto rounded-md bg-secondary text-white h-10 hover:opacity-85 cursor-pointer text-sm"
            type="submit"
            value={isLoading ? "Сохранение..." : "Сохранить"}
          />
        </div>
      </form>
    </div>
  );
}
