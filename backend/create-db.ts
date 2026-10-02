import postgres from 'postgres';
const dbUrl = process.env.DATABASE_URL!.replace('/listendo', '/postgres');
const sql = postgres(dbUrl);
async function run() {
  try {
    await sql`CREATE DATABASE listendo`;
    console.log('Database created');
  } catch (e: any) {
    if (e.code === '42P04') {
      console.log('Database already exists');
    } else {
      console.error('Error:', e);
    }
  } finally {
    process.exit(0);
  }
}
run();
