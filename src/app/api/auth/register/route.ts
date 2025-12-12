"use server";

import { z } from "zod";
import pool from "@/src/lib/db";
import bcrypt from "bcryptjs";
import { createSessionToken } from "@/src/lib/auth";
import { NextResponse } from "next/server";

// проверка логина
async function checkEmailAvailability(email: string): Promise<Boolean> {
  try {
    const data = await pool.query(`SELECT * FROM users WHERE email=$1`, [
      email,
    ]);
    return data.rows.length > 0 ? false : true;
  } catch (error) {
    throw new Error("Ошибка проверки данных почты.");
  }
}

// валидация формы регистрации с помощью zod
const RegistrationFormSchema = z
  .object({
    email: z.email("Некорректный email").refine(
      async (value) => {
        const isAvailable = await checkEmailAvailability(value);
        return isAvailable;
      },
      { message: "Логин уже занят" }
    ),
    password: z.string().min(4, "Минимум 4 символа"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const validatedFields = await RegistrationFormSchema.safeParseAsync(body);

  if (!validatedFields.success) {
    return NextResponse.json(
      { errors: validatedFields.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { email, password, confirmPassword } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      `
      INSERT INTO users (email, password)
      VALUES ($1, $2);
    `,
      [email, hashedPassword]
    );
    const jwt = require("jsonwebtoken");
    const response = await pool.query(
      `
      SELECT * FROM users WHERE email=$1
    `,
      [body.email]
    );
    const user = response.rows[0];
    
    // установка файла cookie
    const token = await createSessionToken(user.id, user.email);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Set-Cookie": `session=${token}; Path=/; HttpOnly; 
         Secure; SameSite=Strict; Max-Age=86400`,
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    return NextResponse.json({ status: 500 });
  }
}
