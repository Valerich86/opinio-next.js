"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ImStatsBars } from "react-icons/im"; 
import { MdOutlineUnpublished } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Survey } from "../lib/definitions";
import { headlineFont } from "../lib/fonts";
import { EnterLink } from "./UI/buttons";

export default function SurveysList({userId}:{userId?:string}) {
  const [publishedSurveys, setPublishedSurveys] = useState<Survey[]>([]);
  const [unpublishedSurveys, setUnpublishedSurveys] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetchSurveys(userId);
  }, [refresh]);

  async function fetchSurveys(userId?: string) {
    try {
      const result = await fetch(`/api/users/${userId}`);
      const { published, unpublished } = await result.json();
      setUnpublishedSurveys(unpublished);
      setPublishedSurveys(published);
    } catch (err) {
      console.error(err);
    }
  }

  if (publishedSurveys.length === 0 && unpublishedSurveys.length === 0)
    return (
      <div className="flex gap-5 flex-col justify-center items-center w-full">
        <p>Своих опросов пока нет...</p>
        <EnterLink />
      </div>
    );

  const SurveyItem = ({ item }: { item: Survey }) => {
    async function handleSubmitPublish() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/surveys/${item.id}`, {
          method: "PUT",
          body: JSON.stringify({ publish: false }),
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) setRefresh(!refresh);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    return (
      <>
        {!item.is_published && (
          <Link href={`/newSurvey/${item.id}`}>
            <p className="underline text-lg hover:opacity-70">
              {item.title}{" "}
              <span className="text-xs italic">
                {" "}
                Создан: {new Date(item.created_at).toLocaleDateString()}
              </span>
            </p>
          </Link>
        )}
        {item.is_published && (
          <div className="flex items-center gap-x-10 gap-y-5 flex-wrap">
            <p className="text-xl">
              {item.title}{" "}
              <span className="text-xs italic">
                {" "}
                Создан: {new Date(item.created_at).toLocaleDateString()}
              </span>
            </p>
            <Link
              href={`/surveys/${item.id}`}
              className="rounded-md py-2 w-[220px] text-sm text-light hover:opacity-70 bg-neutral active:scale-99 active:transition active:duration-100 font-semibold flex gap-2 justify-center items-center cursor-pointer"
            >
              <ImStatsBars size={17}/>
              {`${isLoading ? "" : "Статистика"}`}
              {isLoading && (
                <FaSpinner className="animate-spin" size={20} color="white" />
              )}
            </Link>
            <button
              onClick={handleSubmitPublish}
              className="rounded-md border border-red-500 py-2 w-[220px] text-sm text-red-500 hover:opacity-70 active:scale-99 active:transition active:duration-100 font-semibold flex gap-2 justify-center items-center cursor-pointer"
              disabled={isLoading}
            >
              <MdOutlineUnpublished size={20} />
              {`${isLoading ? "" : "Снять с публикации"}`}
              {isLoading && (
                <FaSpinner className="animate-spin" size={20} color="white" />
              )}
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      {unpublishedSurveys.length > 0 && (
        <div className="w-full">
          <h2 className={`${headlineFont.className} text-2xl text-center mb-2`}>
            Неопубликованные опросы ({unpublishedSurveys.length}):
          </h2>
          <motion.ul
            className="w-full flex flex-col gap-5 list-disc"
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {unpublishedSurveys.map((item) => (
                <motion.li
                  key={item.id}
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
      {publishedSurveys.length > 0 && (
        <div className="w-full">
          <h2 className={`${headlineFont.className} text-2xl text-center mb-2`}>
            Опубликованные опросы ({publishedSurveys.length}):
          </h2>
          <motion.ul
            className="w-full flex flex-col gap-5 list-disc"
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {publishedSurveys.map((item) => (
                <motion.li
                  key={item.id}
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
