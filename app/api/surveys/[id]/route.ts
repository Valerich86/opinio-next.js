import pool from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const survey = await pool.query("SELECT * FROM surveys WHERE id = $1", [
      id,
    ]);
    const questions = await pool.query(
      "SELECT * FROM questions WHERE survey_id = $1 ORDER BY sort_order",
      [id]
    );
    return NextResponse.json({
      survey: survey.rows[0],
      questions: questions?.rows,
    });
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const {title, publish} = await request.json();
    if (title) {
      await pool.query("UPDATE surveys SET title = $1 WHERE id = $2", [
        title,
        id,
      ]);
    } 
    else {
      await pool.query("UPDATE surveys SET is_published = $1 WHERE id = $2", [
        publish,
        id,
      ]);
    }
    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.error("Ошибка изменения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await pool.query("DELETE FROM surveys WHERE id = $1", [id]);
    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.error("Ошибка удаления данных:", error);
    return NextResponse.json({ status: 500 });
  }
}
