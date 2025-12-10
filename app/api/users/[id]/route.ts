"use server";

import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const published = await pool.query(
      'SELECT * FROM surveys WHERE user_id=$1 AND is_published=true ORDER BY created_at DESC', [id]
    );
    const unpublished = await pool.query(
      'SELECT * FROM surveys WHERE user_id=$1 AND is_published=false ORDER BY created_at DESC', [id]
    );
    return NextResponse.json({published: published.rows, unpublished: unpublished.rows});
  } catch (error) {
    console.error('Ошибка получения данных:', error);
    return NextResponse.json({ status: 500 });
  }
}
