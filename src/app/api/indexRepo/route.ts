import { NextResponse } from "next/server"
import { indexRepo } from "@/lib/repoIndexer"

export const runtime = "nodejs";

export async function POST(req: Request) {

  const { repo } = await req.json()

  console.log("Indexing repo:", repo)

  await indexRepo(repo)

  return NextResponse.json({
    status: "Repo indexed"
  })

}