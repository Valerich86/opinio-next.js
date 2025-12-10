"use client";

import { headlineFont } from "../lib/fonts";
import { Survey } from "../lib/definitions";
import { useState, useEffect } from "react";

type SurveyWithQuestionsCount = Survey & {
  questions_count: number;
};

type Stats = {
  started: number;
  completed: number;
  conversionRate: string;
  avgDuration: string;
};

export default function SurveyStats({ surveyId }: { surveyId: string }) {
  const [survey, setSurvey] = useState<SurveyWithQuestionsCount | null>(null);
  const [stats, setStats] = useState<Stats|null>(null);

  useEffect(() => {
    fetchSurvey();
    fetchStats();
  }, []);

  async function fetchSurvey() {
    try {
      const result = await fetch(`/api/surveys/${surveyId}`);
      const { survey, questions } = await result.json();
      setSurvey({ ...survey, questions_count: questions.length });
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchStats() {
    try {
      const result = await fetch(`/api/stats/survey/${surveyId}`);
      const data = await result.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  }

  function getConversionColor(conversionRate?: string | null): string {
    if (!conversionRate) return "text-gray-500";
    const match = conversionRate.match(/(\d+)/);
    const value = match ? parseInt(match[1], 10) : 0;
    if (value >= 70) return "text-green-500";
    if (value >= 50) return "text-yellow-500";
    return "text-red-500";
  }

  return (
    <div className="flex flex-col w-full gap-y-10">
      <h1 className={`${headlineFont.className} text-2xl font-extrabold`}>
        {survey?.title}
      </h1>
      <div className="flex flex-col w-full gap-y-3">
        <div>
          <strong>Опубликован:</strong>{" "}
          {survey
            ? new Date(survey.created_at).toLocaleString().substring(0, 10)
            : "-"}
        </div>
        <div>
          <strong>Всего вопросов:</strong> {survey?.questions_count}
        </div>
        <div>
          <strong>Начали проходить:</strong> {stats?.started || 0} человек
        </div>
        <div>
          <strong>Завершили:</strong> {stats?.completed || 0} человек
        </div>
        <div>
          <strong>Конверсия:</strong>{" "}
          <span
            className={`font-semibold ${getConversionColor(
              stats?.conversionRate
            )}`}
          >
            {stats?.conversionRate || "-"}
          </span>
        </div>
        <div>
          <strong>Среднее время прохождения:</strong>{" "}
          <span className="font-medium">{stats?.avgDuration || "нет данных"}</span>
        </div>
      </div>
    </div>
  );
}
