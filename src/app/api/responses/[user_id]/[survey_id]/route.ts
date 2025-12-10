import { NextRequest, NextResponse } from "next/server";
import pool from "@/src/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ user_id: string; survey_id: string }> }
) {
  const { user_id, survey_id } = await params;

  try {
    let response = null;
    const result = await pool.query(
      `SELECT * FROM responses WHERE user_id=$1 AND survey_id=$2;`,
      [user_id, survey_id]
    );
    if (result.rows.length > 0) {
      response = {
        message: "Вы уже проходили этот вопрос ранее. Желаете пройти еще раз?",
        caption: "(Прежние данные будут удалены.)",
      };
    }
    return NextResponse.json({response: response});
  } catch (error) {
    return NextResponse.json({ status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ user_id: string; survey_id: string }> }
) {
  try {
    const { user_id, survey_id } = await params;
    await pool.query("DELETE FROM responses WHERE user_id=$1 AND survey_id=$2;", [user_id, survey_id]);
    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.error("Ошибка удаления данных:", error);
    return NextResponse.json({ status: 500 });
  }
}