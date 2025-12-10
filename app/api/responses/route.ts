"use server";

import { pool } from "../../lib/db";
import { NextResponse } from "next/server";
import { UserResponse, Answer } from "@/app/lib/definitions";

export async function POST(req: Request) {
  const {answers, userId, surveyId} = await req.json();
  try {
    const result = await pool.query(
      `INSERT INTO responses (user_id, survey_id) VALUES ($1, $2) RETURNING id;`, [userId, surveyId]
    );
    const response_id = result.rows[0].id;
    answers.forEach(async (a: Answer) => {
      const {
        question_id,
        single_value,
        multiple_value,
        rating_value,
      } = a;
      await pool.query(
        `INSERT INTO answers (response_id, question_id, single_value, multiple_value, rating_value)
         VALUES ($1, $2, $3, $4, $5);
        `,
        [
          response_id,
          question_id,
          single_value,
          multiple_value,
          rating_value,
        ]
      );
    });
    return NextResponse.json({ status: 201 });
  } catch (error) {
    console.error("Ошибка добавления данных:", error);
    return NextResponse.json({ status: 500 });
  }
}
