"use client";

import { BiAddToQueue } from "react-icons/bi";
import { FormEvent, useState, useEffect } from "react";
import { QuestionTypes, QuestionDefinitions } from "../../lib/constants";
import { Question } from "../../lib/definitions";
import { MdDeleteForever } from "react-icons/md";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  reFetch: () => void;
  questionId: string | undefined;
}

export default function QuestionUpdateModal({
  isOpen,
  closeModal,
  reFetch,
  questionId,
}: ModalProps) {
  const [form, setForm] = useState<Question>({
    id: "",
    survey_id: "",
    text: "",
    type: "",
    answer_options: [],
    sort_order: 1,
  });
  const [currentType, setCurrentType] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!questionId) return;
    getQuestionData();
  }, [isOpen]);

  async function getQuestionData() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/questions/${questionId}`);
      if (res.ok) {
        const { survey_id, text, type, answer_options, sort_order } =
          await res.json();
        setForm({
          ...form,
          survey_id: survey_id,
          text: text,
          type: type,
          answer_options: answer_options,
          sort_order: sort_order,
        });
      } 
    } catch (error) {
      console.error("Ошибка получения данных")
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    closeModal();
    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form }),
      });
    } catch (error) {
      console.error("Ошибка получения данных")
    } finally {
      reFetch();
    }
  }

  const addAnswer = () => {
    let answers = form.answer_options;
    answers.push("");
    setForm({ ...form, answer_options: answers });
  };

  const changeAnswer = (value: string, index: number) => {
    let answers = form.answer_options;
    answers[index] = value;
    setForm({ ...form, answer_options: answers });
  };

  const deleteAnswer = (index: number) => {
    let answers = form.answer_options;
    answers.splice(index, 1);
    setForm({ ...form, answer_options: answers });
  };

  return (
    <div 
    className={
      `w-screen py-20 pl-2 items-center z-10 absolute -top-10 
      ${isOpen ? 'translate-x-0 scale-100' : '-translate-x-full scale-0'} 
      transition-all duration-400`
    }
    >
      <form
        onSubmit={handleSubmit}
        onReset={closeModal}
        className={`mt-10 rounded-md bg-primary w-[90%] md:w-1/3 flex flex-col gap-5 p-10 shadow-xl/20 shadow-[#3066BE]`}
      >
        <fieldset>
          <label htmlFor="text" className="italic text-sm">
            Текст вопроса
          </label>
          <input
            className="w-full rounded-md h-10 border-none p-2 text-sm bg-white placeholder:opacity-90 focus-input"
            id="text"
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
              value={form.sort_order}
              onChange={(e) =>
                setForm({ ...form, sort_order: Number(e.target.value) })
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
                  answer_options: QuestionTypes[Number(e.target.value)].options,
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

        <fieldset>
          <label htmlFor="sortOrder" className="italic text-sm">
            Варианты ответов
          </label>
          <div className="flex flex-col gap-2">
            {form.answer_options.map((item, index) => (
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
                  <MdDeleteForever className="text-red-500" size={22} />
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
