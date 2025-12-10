import { Client, Pool } from "pg";

const client = new Client({ connectionString: process.env.DATABASE_URL });

client.connect();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export default pool;

export { client, pool };
