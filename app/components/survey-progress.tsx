"use client";

import { GiCheckMark } from "react-icons/gi";
import { MdDeleteForever } from "react-icons/md";
import { BsPencilFill } from "react-icons/bs";
import { FaSpinner } from "react-icons/fa"; 
import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Question, Survey } from "../lib/definitions";
import QuestionUpdateModal from "./modal-question";
import SurveyUpdateModal from "./modal-survey";
import { useRouter } from "next/navigation";

export default function SurveyProgress({ id }: { id: string }) {
  const [survey, setSurvey] = useState<null | Survey>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionModalIsOpen, setQuestionModalIsOpen] = useState(false);
  const [surveyModalIsOpen, setSurveyModalIsOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("");
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchSurvey();
  }, [id, refresh]);

  const openQuestionModal = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setQuestionModalIsOpen(true);
  };

  const closeQuestionModal = () => {
    setQuestionModalIsOpen(false);
    setSelectedQuestionId("");
  };

  const openSurveyModal = () => {
    setSurveyModalIsOpen(true);
  };

  const closeSurveyModal = () => {
    setSurveyModalIsOpen(false);
  };

  const reFetch = () => {
    setRefresh(!refresh);
  };

  async function fetchSurvey() {
    try {
      const res = await fetch(`/api/surveys/${id}`);
      if (res.ok) {
        const { survey, questions } = await res.json();
        setSurvey(survey);
        setQuestions(questions);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function dropQuestion(questionId: string) {
    try {
      const res = await fetch(`/api/questions/${questionId}`, {
        method: "DELETE",
      });
      if (res.ok) setRefresh(!refresh);
    } catch (err) {
      console.error(err);
    }
  }

  async function dropSurvey() {
    try {
      const res = await fetch(`/api/surveys/${id}`, {
        method: "DELETE",
      });
      if (res.ok) router.back();
    } catch (err) {
      console.error(err);
    }
  }

  const QuestionItem = ({ item }: { item: Question }) => {
    return (
      <div className="border-b border-b-gray-400 py-3">
        <div className="italic mb-5 flex flex-wrap gap-2 items-center">
          {`${item.sort_order}. ${item.text} (${item.type})`}
          <div
            className="hover:opacity-80 cursor-pointer"
            onClick={() => openQuestionModal(item.id)}
          >
            <BsPencilFill className="text-neutral" />
          </div>
          <div
            className="hover:opacity-80 cursor-pointer"
            onClick={() => dropQuestion(item.id)}
          >
            <MdDeleteForever className="text-red-500" size={22} />
          </div>
        </div>
        <ul className="list-disc w-full flex gap-x-50 gap-y-5 flex-wrap">
          {item.answer_options?.map((answer, index) => (
            <li key={index} className="text-sm">
              {answer}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  async function handleSubmitPublish(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`/api/surveys/${id}`, {
        method: "PUT",
        body: JSON.stringify({publish: true}),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) router.replace("/profile");
    } catch (error) {
      console.error(error);
    } 
  }

  if (!survey)
    return (
      <div className="flex gap-2 flex-wrap justify-center items-center">
        <p>Добавляются новые данные...</p>
      </div>
    );

  return (
    <div className="w-full">
      <div className="flex gap-2 flex-wrap justify-center items-center mb-5">
        <h2 className="text-xl text-blue-900 text-center">"{survey.title}"</h2>
        <div
          className="hover:opacity-80 cursor-pointer"
          onClick={openSurveyModal}
        >
          <BsPencilFill className="text-neutral" />
        </div>
        <div className="hover:opacity-80 cursor-pointer" onClick={dropSurvey}>
          <MdDeleteForever className="text-red-500" size={22} />
        </div>
      </div>
      <motion.ul initial="hidden" animate="visible">
        <AnimatePresence>
          {questions?.map((item: Question) => (
            <motion.li
              key={item.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              layout
            >
              <QuestionItem item={item} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {questions.length > 0 && (
        <form
          className="w-full flex justify-center mt-10"
          onSubmit={handleSubmitPublish}
        >
          <button
            type="submit"
            className="px-y rounded-md bg-accent text-white h-10 hover:opacity-85 cursor-pointer w-full md:w-1/3 flex justify-center items-center gap-5 text-lg"
          >
            <GiCheckMark size={30} />{" "}
            {`${isLoading ? "" : "Опубликовать"}`}
            {isLoading && <FaSpinner className="animate-spin" size={20} color="white"/>}
          </button>
        </form>
      )}
      <QuestionUpdateModal
        isOpen={questionModalIsOpen}
        closeModal={closeQuestionModal}
        reFetch={reFetch}
        questionId={selectedQuestionId}
      />
      <SurveyUpdateModal
        isOpen={surveyModalIsOpen}
        closeModal={closeSurveyModal}
        reFetch={reFetch}
        surveyId={id}
      />
    </div>
  );
}

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.4 } },
};
