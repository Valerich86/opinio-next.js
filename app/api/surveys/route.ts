"use server";

import { z } from "zod";
import { pool } from "../../lib/db";
import { NextResponse } from "next/server";

const SurveyFormSchema = z.object({
  userId: z.string(),
  title: z.string().trim().min(3, "Минимум 3 символа"),
});

export async function POST(req: Request) {
  const body = await req.json();
  const validatedFields = await SurveyFormSchema.safeParseAsync(body);
  if (!validatedFields.success) {
    return NextResponse.json(
      { errors: validatedFields.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const { userId, title } = validatedFields.data;
  try {
    const result = await pool.query(
      `INSERT INTO surveys (user_id, title)
       VALUES ($1, $2) RETURNING id;
      `,
      [userId, title]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Ошибка добавления данных:", error);
    return NextResponse.json({ status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const surveys = await pool.query(`
      SELECT 
        s.id AS survey_id,
        s.title,
        s.created_at,
        u.email AS username,
        COUNT(q.id) AS questions_count
      FROM surveys s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN questions q ON s.id = q.survey_id
      WHERE s.is_published = TRUE
      GROUP BY s.id, u.email
      ORDER BY s.created_at DESC;
    `);
    return NextResponse.json(surveys.rows);
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return NextResponse.json({ status: 200 });
  }
}
