import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export async function embed(text: string) {

  if (!text || text.trim().length === 0) {
    throw new Error("Embedding input is empty")
  }

  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text
  })

  return res.data[0].embedding
}