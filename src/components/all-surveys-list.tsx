"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { headlineFont } from "../lib/fonts";
import { EnterLink } from "./buttons";

interface Survey {
  survey_id: string;
  title: string;
  created_at: string;
  username: string;
  questions_count: number
}

export default function SurveysList() {
  const [surveys, setSurveys] = useState<Survey[]>([]);

  useEffect(() => {
    fetchSurveys();
  }, []);

  async function fetchSurveys() {
    try {
      const result = await fetch(`/api/surveys`);
      const surveys = await result.json();
      setSurveys(surveys);
    } catch (err) {
      console.error(err);
    }
  }

  if (surveys.length === 0)
    return (
      <div className="flex gap-5 flex-col justify-center items-center">
        <p>Опросов пока нет...</p>
        <EnterLink />
      </div>
    );

  const SurveyItem = ({ item }: { item: Survey }) => {
    return (
      <Link href={`/surveyCompleting/${item.survey_id}`}>
        <div className="
          flex flex-col gap-2 justify-between items-center p-3 rounded-2xl text-light bg-neutral
          hover:shadow-gray-500 hover:shadow-xl/20 hover:invert transition duration-200">
          <p className="text-xl text-center">{item.title}</p>
          <div className="w-full flex justify-around flex-wrap">
            <p className="text-sm">
              <span className="italic">Автор: </span> {item.username}
            </p>
            <p className="text-sm">
              <span className="italic">Создан: </span>{" "}
              {new Date(item.created_at).toLocaleDateString()}
            </p>
            <p className="text-sm">
              <span className="italic">Вопросов: </span> {item.questions_count}
            </p>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <>
      {surveys.length > 0 && (
        <div className="w-full md:w-2/3">
          <h2 className={`${headlineFont.className} text-2xl text-center mb-10`}>
            Наши опросы:
          </h2>
          <motion.ul
            className="w-full flex flex-col gap-5"
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {surveys.map((item) => (
                <motion.li
                  key={item.survey_id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  layout
                >
                  <SurveyItem item={item} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>
      )}
    </>
  );
}

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.4 } },
};
