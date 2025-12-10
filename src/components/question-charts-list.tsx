"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation, Variants } from "framer-motion";
import { ChartItem } from "./question-chart-item";
import QuestionItem from "./question-item";

interface Option {
  value: string;
  votes: number;
}

interface QuestionData {
  text: string;
  type: string;
  options: Option[];
}

export default function ChartsList({ id }: { id: string }) {
  const [questionsData, setQuestionsData] = useState<QuestionData[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    fetchQuestionsData();
  }, []);

  async function fetchQuestionsData() {
    try {
      const response = await fetch(`/api/stats/questions/${id}`);
      const { data, totalVotes } = await response.json();
      if (data) {
        setTotalVotes(totalVotes);
        setQuestionsData(data);
      }
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  if (questionsData[0]?.options.length === 0)
    return (
      <div className="w-full text-center">
        Статистики по вопросам еще нет...
      </div>
    );

  return (
    <>
      {totalVotes > 0 && (
        <>
          <strong>Статистика ответов на вопросы:</strong>
          <ul className="flex flex-wrap justify-between items-center w-full gap-y-20">
            {questionsData.map((item: QuestionData, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }} // анимация только при первом появлении, 10% элемента в зоне видимости
                transition={{ delay: index * 0.1 }} // небольшая задержка для каждого следующего элемента
                className="w-full xl:w-[45%] flex justify-center items-center"
              >
                <ChartItem data={item} sortOrder={index+1}/>
              </motion.li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};
