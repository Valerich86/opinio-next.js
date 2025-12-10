import { client } from "../../lib/db";

async function createExtention() {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

async function createUsersTable() {
  try {
    client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
        );
      `);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

async function createSurveysTable() {
  try {
    client.query(`
      CREATE TABLE IF NOT EXISTS surveys (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        is_published BOOLEAN DEFAULT FALSE,
        created_at DATE DEFAULT CURRENT_DATE
      );
    `);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

async function createQuestionsTable() {
  try {
    client.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        answer_options TEXT[] DEFAULT ARRAY[]::TEXT[],
        sort_order INT DEFAULT 1
      );
    `);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

async function createResponsesTable() {
  try {
    client.query(`
      CREATE TABLE IF NOT EXISTS responses (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
        created_at DATE DEFAULT CURRENT_DATE
      );
    `);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

async function createAnswersTable() {
  try {
    client.query(`
      CREATE TABLE answers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        response_id UUID REFERENCES responses(id) ON DELETE CASCADE,
        question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
        single_value TEXT,
        multiple_value TEXT[] DEFAULT ARRAY[]::TEXT[],
        rating_value INT
      );  
    `);
  } catch (error) {
    return Response.json({error}, {status: 500})
  }
}

async function createSurveyStatsTable() {
  try {
    client.query(`
      CREATE TABLE survey_stats (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
        session_id TEXT,
        event TEXT,
        timestamp TIMESTAMPTZ DEFAULT NOW(),
        total_time INT
      );  
    `);
  } catch (error) {
    return Response.json({error}, {status: 500})
  }
}

export async function GET(req: Request) {
  try {
    await createExtention();
    await createUsersTable();
    await createSurveysTable();
    await createQuestionsTable();
    await createResponsesTable();
    await createAnswersTable();
    await createSurveyStatsTable();
    return Response.json({ message: "База данных создана / обновлена" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
