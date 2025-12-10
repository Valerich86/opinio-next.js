import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await pool.query("DELETE FROM questions WHERE id = $1", [id]);
    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.error("Ошибка удаления данных:", error);
    return NextResponse.json({ status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await pool.query("SELECT * FROM questions WHERE id = $1", [
      id,
    ]);
    return NextResponse.json(result.rows[0]);
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
    const body = (await request.json()).form;
    const {text, type, answer_options, sort_order } = body;
    await pool.query(
      "UPDATE questions SET text = $1, type = $2, answer_options = $3, sort_order = $4 WHERE id = $5",
      [text, type, answer_options, sort_order, id]
    );
    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.error("Ошибка изменения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}
