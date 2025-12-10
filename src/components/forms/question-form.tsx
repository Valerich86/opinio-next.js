"use client";

import { BiAddToQueue } from "react-icons/bi";
import { FormEvent, useState } from "react";
import { QuestionTypes, QuestionDefinitions } from "../lib/constants";
import { Question } from "../lib/definitions";
import { MdDeleteForever } from "react-icons/md";

export default function QuestionForm({ id }: { id: string }) {
  const [form, setForm] = useState({
    surveyId: id,
    text: "",
    type: QuestionTypes[0].value,
    answerOptions: QuestionTypes[0].options,
    sortOrder: 1,
  });
  const [currentType, setCurrentType] = useState(0);
  const [error, setError] = useState("");
  const [reset, setReset] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form }),
      });
    } catch (error) {
      setError("Произошла ошибка. Попробуйте ещё раз.");
    } finally {
      handleClear();
      setIsLoading(false);
    }
  }

  function handleClear() {
    console.log(QuestionTypes[0].options);
    setError("");
    setCurrentType(0);
    setForm({
      surveyId: id,
      text: "",
      type: QuestionTypes[0].value,
      answerOptions: QuestionTypes[0].options,
      sortOrder: 1,
    });
  }

  const addAnswer = () => {
    let answers = form.answerOptions;
    answers.push("");
    setForm({ ...form, answerOptions: answers });
  };

  const changeAnswer = (value: string, index: number) => {
    let answers = form.answerOptions;
    answers[index] = value;
    setForm({ ...form, answerOptions: answers });
  };

  const deleteAnswer = (index: number) => {
    let answers = form.answerOptions;
    answers.splice(index, 1);
    setForm({ ...form, answerOptions: answers });
  };

  return (
    <form
      onSubmit={handleSubmit}
      onReset={handleClear}
      className={`mt-3 py-10 px-5 rounded-xl bg-primary border-[#3066BE] shadow-[#3066BE] shadow-2xl w-[90%] md:w-1/2 flex flex-col gap-5`}
    >
      <fieldset>
        <label htmlFor="text" className="italic text-sm">
          Текст вопроса
        </label>
        <input
          className="w-full rounded-md h-10 border-none p-2 text-sm bg-white placeholder:opacity-90 focus-input"
          id="text"
          autoFocus
          required
          placeholder="введите текст вопроса"
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
        />
      </fieldset>

      <div className="w-full md:flex justify-between items-center">
        <fieldset className="flex flex-col w-full md:w-[40%]">
          <label htmlFor="sortOrder" className="italic text-sm">
            Порядковый номер
          </label>
          <input
            className="w-full rounded-md h-10 border-none p-2 text-sm bg-white placeholder:opacity-90 focus-input"
            id="sortOrder"
            type="number"
            step="1"
            min="1"
            required
            value={form.sortOrder}
            onChange={(e) =>
              setForm({ ...form, sortOrder: Number(e.target.value) })
            }
          />
        </fieldset>
        <fieldset className="flex flex-col w-full md:w-[40%]">
          <label htmlFor="type" className="italic text-sm">
            Тип вопроса
          </label>
          <select
            className="w-full rounded-md h-10 border-none p-2 text-sm bg-white focus-input"
            id="type"
            value={currentType}
            onChange={(e) => {
              setCurrentType(Number(e.target.value));
              setForm({
                ...form,
                answerOptions: QuestionTypes[Number(e.target.value)].options,
                type: QuestionTypes[Number(e.target.value)].value,
              });
            }}
            required
          >
            {QuestionTypes.map((item: QuestionDefinitions) => (
              <option key={item.value} value={item.id}>
                {item.value}
              </option>
            ))}
          </select>
        </fieldset>
      </div>
      <p>{QuestionTypes[currentType].description}</p>
      {currentType != 2 && currentType != 3 && currentType != 4 && (
        <fieldset>
          <label htmlFor="sortOrder" className="italic text-sm">
            Варианты ответов
          </label>
          <div className="flex flex-col gap-2">
            {form.answerOptions.map((item, index) => (
              <div
                key={index}
                className="w-full flex justify-between items-center"
              >
                <input
                  className="w-[90%] rounded-md h-10 border-none p-2 text-sm bg-white text-zinc-600 focus-input"
                  value={item}
                  onChange={(e) => changeAnswer(e.target.value, index)}
                />
                <div
                  className="hover:opacity-80 cursor-pointer"
                  onClick={() => deleteAnswer(index)}
                >
                  <MdDeleteForever className="text-red-700" size={22} />
                </div>
              </div>
            ))}
            <div
              onClick={addAnswer}
              className="w-full h-10 gap-2 hover:opacity-80 cursor-pointer border border-zinc-400 rounded-sm flex justify-center items-center  text-zinc-600"
            >
              <BiAddToQueue className="text-neutral" size={20} />
              <p>ещё вариант</p>
            </div>
          </div>
        </fieldset>
      )}

      <div className="w-full mt-5 md:flex md:flex-row flex-col justify-between items-center">
        <button
          type="reset"
          className="md:px-5 w-full md:w-auto rounded-md border border-zinc-400 h-10 hover:opacity-70 cursor-pointer text-sm"
        >
          Сбросить
        </button>
        <input
          className="mt-2 md:mt-0 md:px-5 w-full md:w-auto rounded-md bg-accent text-white h-10 hover:opacity-85 cursor-pointer text-sm"
          type="submit"
          value={isLoading ? "Сохранение..." : "Сохранить и продолжить"}
        />
      </div>
    </form>
  );
}
