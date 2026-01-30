export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    DATABASE_URL: process.env.DATABASE_URL,
    TYPE: typeof process.env.DATABASE_URL,
    LENGTH: process.env.DATABASE_URL?.length ?? null,
  });
}