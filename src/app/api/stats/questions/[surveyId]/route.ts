import { NextRequest, NextResponse } from "next/server";
import pool from "@/src/lib/db";
import { Answer, Question } from "@/src/lib/definitions";

interface Option {
  value: string;
  votes: number;
}

interface QuestionData {
  text: string;
  type: string;
  options: Option[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ surveyId: string }> }
) {
  const { surveyId } = await params;
  let chartData: QuestionData[] = [];

  try {
    let result = await pool.query(
      `SELECT * FROM questions WHERE survey_id=$1;`,
      [surveyId]
    );
    const questions = result.rows;
    result = await pool.query(
      `SELECT COUNT(*) AS count FROM responses WHERE survey_id=$1;`,
      [surveyId]
    );
    const totalVotes = Number(result.rows[0].count);
    for (let q of questions) {
      let options: Option[] = [];
      if (
        ["Одиночный выбор", "Логический", "Шкала Лайкерта"].includes(q.type)
      ) {
        for (const o of q.answer_options) {
          const result = await pool.query(
            `SELECT COUNT(*) AS count FROM answers WHERE single_value = $1 AND question_id = $2;`,
            [o, q.id]
          );
          options.push({ value: o, votes: Number(result.rows[0].count) });
        }
      }
      if (q.type === "Шкала оценок") {
        for (const o of [1, 2, 3, 4, 5]) {
          const result = await pool.query(
            `SELECT COUNT(*) AS count FROM answers WHERE rating_value = $1 AND question_id = $2;`,
            [o, q.id]
          );
          options.push({
            value: o.toString(),
            votes: Number(result.rows[0].count),
          });
        }
      }
      if (q.type === "3 свободных ответа") {
        const result = await pool.query(
          `SELECT 
            unnest(multiple_value) AS option_value,
            COUNT(*) AS count
          FROM answers
          WHERE multiple_value IS NOT NULL 
            AND question_id = $1
            AND array_length(multiple_value, 1) > 0
          GROUP BY option_value
          ORDER BY count DESC
          LIMIT 3;`, [q.id]
        );
        options = result.rows.map((row) => ({
          value: row.option_value,
          votes: parseInt(row.count, 10),
        }));
      }
      if (q.type === "Свободный ответ") {
        const result = await pool.query(
          `SELECT 
            single_value,
            COUNT(*) AS count
          FROM answers
          WHERE single_value IS NOT NULL 
            AND question_id = $1
          GROUP BY single_value
          ORDER BY count DESC
          LIMIT 3;`, [q.id]
        );
        options = result.rows.map((row) => ({
          value: row.single_value,
          votes: parseInt(row.count, 10),
        }));
      }
      if (q.type === "Множественный выбор") {
        for (const o of q.answer_options) {
          const result = await pool.query(
            `SELECT COUNT(*) AS count FROM answers WHERE $1 = ANY(multiple_value) AND question_id = $2;`,
            [o, q.id]
          );
          options.push({ value: o, votes: Number(result.rows[0].count) });
        }
      }
      chartData.push({ text: q.text, type: q.type, options: options });
    }
    return NextResponse.json({ data: chartData, totalVotes: totalVotes });
  } catch (error) {
    console.error("Ошибка получения данных: ", error);
    return NextResponse.json({ status: 500 });
  }
}
