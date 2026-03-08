import { NextResponse } from "next/server"
import { queryRAG } from "@/lib/ragPipeline"

export const runtime = "nodejs";

export async function POST(req: Request) {

  const body = await req.json()

  const question = body.question

  if (!question) {
    return NextResponse.json({ error: "Missing question" }, { status: 400 })
  }

  const answer = await queryRAG(question)

  return NextResponse.json({ answer })

}