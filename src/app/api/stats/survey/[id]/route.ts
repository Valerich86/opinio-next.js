import { NextRequest, NextResponse } from "next/server";
import { SurveyStats } from "@/src/lib/definitions";
import pool from "@/src/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const result = await pool.query(
      `SELECT * FROM survey_stats WHERE survey_id=$1;`,
      [id]
    );
    const surveyStats = result.rows;
    if (surveyStats.length === 0) {
      return NextResponse.json({ data: false });
    }

    const startedEvents = surveyStats.filter(
      (s) => s.survey_id === id && s.event === "started"
    );
    const completedEvents = surveyStats.filter(
      (s) => s.survey_id === id && s.event === "completed"
    );

    const startedSessions = new Set(startedEvents.map((s) => s.session_id));
    const completedSessions = completedEvents
      .filter((e) => startedSessions.has(e.session_id))
      .map((e) => e.session_id);

    const conversionRate =
      startedSessions.size > 0
        ? Math.round((completedSessions.length / startedSessions.size) * 100)
        : 0;

    const avgDuration =
      completedSessions.length > 0
        ? Math.round(
            completedEvents
              .filter((e) => completedSessions.includes(e.session_id))
              .reduce((sum, e) => sum + (e.total_time || 0), 0) /
              completedSessions.length
          )
        : 0;

    return new Response(
      JSON.stringify({
        started: startedSessions.size,
        completed: completedSessions.length,
        conversionRate: `${conversionRate}%`,
        avgDuration: formatDuration(avgDuration),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins} мин ${secs} сек`;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const {session_id, event, total_time} = await request.json();
  try {
    await pool.query(
      `INSERT INTO survey_stats (survey_id, session_id, event, total_time) VALUES ($1, $2, $3, $4);`, [id, session_id, event, total_time]
    );
    return NextResponse.json({status: 201});
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}
