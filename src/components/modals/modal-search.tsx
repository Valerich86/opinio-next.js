"use client";

import { FormEvent, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function SearchModal({
  isOpen,
  closeModal,
}: ModalProps) {
  const [searchString, setSearchString] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    closeModal();
    try {
      // const response = await fetch(`/api/surveys`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ search: searchString }),
      // });
      console.log(searchString);
    } catch (error) {
      console.error(error);
    } 
  }

  return (
    <div
      className={`w-screen py-20 pl-2 items-center z-10 absolute -top-10 
      ${isOpen ? "translate-x-[10vw] md:translate-x-[65vw] scale-100" : "translate-x-[110vw] scale-0"} 
      transition-all duration-400`}
    >
      <form
        onSubmit={handleSubmit}
        onReset={closeModal}
        className={`mt-10 rounded-md bg-primary w-[90%] md:w-1/3 flex flex-col gap-5 p-10 shadow-xl/20 shadow-[#3066BE]`}
      >
        <input
          className="w-full rounded-md h-10 border-none p-2 text-sm bg-white placeholder:opacity-90 focus-input"
          id="title"
          autoFocus
          placeholder="Введите значение, например 'кино'"
          required
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
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
            value={"Поиск"}
          />
        </div>
      </form>
    </div>
  );
}
