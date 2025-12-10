"use server";

import { success, z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { pool } from "../../../../lib/db";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { User } from "../../../../lib/definitions";
import { createSessionToken } from '@/src/lib/auth';
import { NextRequest } from 'next/server';

async function checkAvailability(
  email: string,
  password: string
): Promise<User | null> {
  try {
    const data = await pool.query(`SELECT * FROM users WHERE email=$1`, [
      email,
    ]);
    if (data.rows.length === 0) return null;
    let user: User = data.rows[0];
    if (user.email === email) {
      const passwordsMatch = await bcrypt.compare(password, user.password);
      if (!passwordsMatch) return null;
      else return user;
    } else return null;
  } catch (error) {
    throw new Error("Ошибка проверки данных пользователя.");
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const user = await checkAvailability(body.email, body.password);
  if (!user) {
    return new Response(
      JSON.stringify({ error: "Ошибка входа. Проверьте введенные данные!" }), { status: 406 }
    );
  }
  const token = await createSessionToken(user.id, user.email);

  return new Response(
    JSON.stringify({ success: true }),
    {
      status: 200,
      headers: {
        'Set-Cookie': `session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`,
        'Content-Type': 'application/json',
      },
    }
  );
}




