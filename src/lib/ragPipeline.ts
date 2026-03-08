import { embed } from "./embedder"
import { index } from "./pineconeClient"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export async function queryRAG(question: string) {

  console.log("Embedding query...")

  const vector = await embed(question)

  console.log("Querying Pinecone...")

  const results = await index.query({
    vector,
    topK: 8,
    includeMetadata: true
  })

  const matches = results.matches || []

  if (matches.length === 0) {
    return "No relevant code found in the indexed repository."
  }

  console.log("Matches found:", matches.length)
/* OLD CODE
  const context = matches
    .map((m: any) => m.metadata?.text || "")
    .join("\n\n")
*/
const context = matches
  .map((m:any)=>{

    const file = m.metadata?.file || "unknown-file"
    const text = m.metadata?.text || ""

    return `
FILE: ${file}

CODE:
${text}
`

  })
  .join("\n\n---------------------\n\n")

  const prompt = `
You are a code analysis assistant.

Answer the question using ONLY the provided repository code context.

REPOSITORY CODE CONTEXT:
${context}

QUESTION:
${question}

Answer briefly and clearly.
`

  const response = await openai.chat.completions.create({

    model: "gpt-4o-mini",

    messages: [
      { role: "system", content: "You are a helpful code assistant." },
      { role: "user", content: prompt }
    ]

  })

  return response.choices[0].message.content
}