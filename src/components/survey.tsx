"use client";

import { FormEvent, useState, useEffect, useMemo, useCallback } from "react";
import { motion, useAnimation, Variants } from "framer-motion";
import { Survey, Question, Answer } from "../lib/definitions";
import { useRouter } from "next/navigation";
import QuestionItem from "./question-item";
import FormError from "./UI/form-error";
import { GiCheckMark } from "react-icons/gi";
import { FaSpinner } from "react-icons/fa";

interface ResponseMessage {
  message: string;
  caption: string;
}

export default function CompleteSurvey({
  id,
  userId,
}: {
  id?: string;
  userId?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] =
    useState<ResponseMessage | null>(null);
  const [survey, setSurvey] = useState<Survey | undefined>(undefined);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [startButtonVisible, setStartButtonVisible] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const hiddenArray = [0, 1, 2];
  const controls = useAnimation();
  const router = useRouter();

  useEffect(() => {
    if (!id || questions.length > 0) return;
    getResponseData();
    const newSessionId = crypto.randomUUID();
    localStorage.setItem("survey_session_id", newSessionId);
  }, [id, questions.length]);

  async function getResponseData() {
    try {
      const res = await fetch(`/api/responses/${userId}/${id}`);
      const { response } = await res.json();
      setResponseMessage(response);
    } catch (error) {
      console.error(error);
    }
  }

  async function startSurvey() {
    setStartButtonVisible(false);
    localStorage.setItem("survey_start_time", Date.now().toString());
    try {
      const response = await fetch(`/api/stats/survey/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: localStorage.getItem("survey_session_id"),
          event: "started",
          total_time: 0,
        }),
      });
      if (response.ok) await getSurveyData();
    } catch (error) {
      console.error(error);
    }
  }

  async function getSurveyData() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/surveys/${id}`);
      if (res.ok) {
        const { survey, questions } = await res.json();
        setSurvey(survey);
        setQuestions(questions);
        const initialAnswers = questions.map((q: Question) => ({
          id: "",
          response_id: "",
          question_id: q.id,
          single_value: "",
          multiple_value: q.type === "3 свободных ответа" ? ["", "", ""] : [],
          rating_value: 0,
        }));
        setAnswers(initialAnswers);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      controls.start("visible");
    }
  }

  async function deleteOldData() {
    try {
      const response = await fetch(`/api/responses/${userId}/${id}`, {
        method: "DELETE"
      });
      if (response.ok) setStartButtonVisible(true);
    } catch (error) {
      console.error(error);
    }
  }

  const onAnswerChange = useCallback((updatedAnswer: Answer) => {
    setAnswers((prev) =>
      prev.map((ans) =>
        ans.question_id === updatedAnswer.question_id ? updatedAnswer : ans
      )
    );
  }, []);

  const isFormValid = () => {
    return questions.every((q) => {
      const ans = answers.find((a) => a.question_id === q.id);
      if (!ans) return false;

      switch (q.type) {
        case "Одиночный выбор":
        case "Шкала Лайкерта":
        case "Свободный ответ":
        case "Логический":
          return ans.single_value.trim() !== "";
        case "Множественный выбор":
          return ans.multiple_value.length > 0;
        case "3 свободных ответа":
          return (
            ans.multiple_value.length === 3 &&
            ans.multiple_value.every((v) => v.trim() !== "")
          );
        case "Шкала оценок":
          return ans.rating_value > 0;
        default:
          return true;
      }
    });
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(answers);
    if (!isFormValid()) {
      setError("Не все вопросы заполнены корректно.");
      return;
    }
    setIsLoading(true);
    const startTime = localStorage.getItem("survey_start_time");
    const totalTime = startTime
      ? Math.round((Date.now() - parseInt(startTime)) / 1000)
      : 0;
    try {
      await fetch(`/api/stats/survey/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          survey_id: id,
          session_id: localStorage.getItem("survey_session_id"),
          event: "completed",
          total_time: totalTime,
        }),
      });
      const response = await fetch(`/api/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: answers,
          userId: userId,
          surveyId: id,
        }),
      });
      if (response.ok) router.back();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  if (responseMessage)
    return (
      <form className={`w-full flex flex-col gap-7 p-10`} onSubmit={deleteOldData}>
        <h2>{responseMessage.message}</h2>
        <p className="italic">{responseMessage.caption}</p>
        <div className="flex flex-col md:flex-row md:justify-between w-full md:w-1/3 gap-y-2">
          <button
            className="p-2 rounded-md hover:opacity-85 border border-gray-500 active:scale-99 cursor-pointer flex justify-center items-center text-lg"
            onClick={() => router.back()}
            type="reset"
          >
            Назад
          </button>
          <button
            className="p-2 rounded-md bg-accent text-white hover:opacity-85 active:scale-99 cursor-pointer flex justify-center items-center gap-5 text-lg"
            type="submit"
            disabled={isLoading}
          >
            <GiCheckMark size={30} /> {`${isLoading ? "" : "Пройти ещё раз"}`}
            {isLoading && (
              <FaSpinner className="animate-spin" size={20} color="white" />
            )}
          </button>
        </div>
      </form>
    );

  return (
    <>
      {startButtonVisible && (
        <button
          className="p-2 rounded-md bg-accent text-white hover:opacity-85 active:scale-99 cursor-pointer flex justify-center items-center gap-5 text-lg"
          disabled={isLoading}
          onClick={startSurvey}
        >
          <GiCheckMark size={30} /> {`${isLoading ? "" : "Начать прохождение"}`}
          {isLoading && (
            <FaSpinner className="animate-spin" size={20} color="white" />
          )}
        </button>
      )}
      {survey && (
        <form
          onSubmit={handleSubmit}
          className={`w-full flex flex-col gap-7 p-10`}
        >
          <h1 className="text-3xl font-extrabold text-accent text-center">
            Опрос: "{survey?.title}"
          </h1>
          <motion.ul
            variants={listVariants}
            initial="hidden"
            animate={"visible"}
            className="flex flex-col gap-y-5"
          >
            {questions?.map((item) => {
              const answer = answers.find((a) => a.question_id === item.id) || {
                id: "",
                response_id: "",
                question_id: item.id,
                single_value: "",
                multiple_value:
                  item.type === "3 свободных ответа" ? ["", "", ""] : [],
                rating_value: 0,
              };
              return (
                <motion.li key={item.id} variants={itemVariants}>
                  <QuestionItem
                    item={item}
                    answer={answer}
                    onAnswerChange={onAnswerChange}
                  />
                </motion.li>
              );
            })}
          </motion.ul>
          <FormError errorField={error} />
          <button
            className="px-y rounded-md bg-accent text-white h-10 hover:opacity-85 active:scale-99 cursor-pointer w-full md:w-1/3 flex justify-center items-center gap-5 text-lg"
            type="submit"
            disabled={isLoading}
          >
            <GiCheckMark size={30} /> {`${isLoading ? "" : "Завершить опрос"}`}
            {isLoading && (
              <FaSpinner className="animate-spin" size={20} color="white" />
            )}
          </button>
        </form>
      )}
    </>
  );
}

const listVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Задержка между элементами
      delayChildren: 0.3, // Небольшая задержка перед началом
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};
