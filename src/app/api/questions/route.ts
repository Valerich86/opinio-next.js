"use server";

import { pool } from "../../../lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = (await req.json()).form;
  const { surveyId, text, type, answerOptions, sortOrder } = body;
  try {
    const result = await pool.query(
      `INSERT INTO questions (survey_id, text, type, answer_options, sort_order)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `,
      [surveyId, text, type, answerOptions, sortOrder]
    );
    return NextResponse.json(result.rows[0], {status: 201});
  } catch (error) {
    console.error('Ошибка добавления данных:', error);
    return NextResponse.json({ status: 500 });
  }
}



