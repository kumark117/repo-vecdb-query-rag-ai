"use client"

import { useState } from "react"

export default function Home() {

  const [repoUrl, setRepoUrl] = useState("https://github.com/kumark117/repo-vecdb-query-rag-ai")
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [logs, setLogs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  function log(msg: string) {
    const time = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${time}] ${msg}`])
  }

  async function indexRepo() {

    if (!repoUrl) return

    log("Starting repo indexing...")

    setLoading(true)

    try {

      const res = await fetch("/api/indexRepo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          repo: repoUrl
        })
      })

      const data = await res.json()

      if (!res.ok) {
        log("Indexing failed")
        console.error(data)
      } else {
        log("Repo indexed successfully")
      }

    } catch (err) {

      log("Indexing error")
      console.error(err)

    }

    setLoading(false)
  }

  async function askQuestion() {

    if (!question) return

    log("Sending query to RAG...")

    setLoading(true)

    try {

      const res = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question
        })
      })

      const data = await res.json()

      if (!res.ok) {

        log("Query failed")
        console.error(data)

      } else {

        setAnswer(data.answer)

        log("Answer received")

      }

    } catch (err) {

      log("Query error")
      console.error(err)

    }

    setLoading(false)
  }

  return (

    <div style={{ padding: 40, fontFamily: "sans-serif" }}>

      <h1 style={{ color: "green" }}>
        Next.js Repo <i>RAG</i> (with openAI) Explorer, hosted on Vercel
      </h1>
<div style={{marginBottom:"20px", fontSize:"14px"}}>
  AI Repo Search — Retrieval Augmented Generation Demo
  <br />
  Next.js + Typescript + Pinecone + OpenAI, hosted on Vercel (serverless)
</div>
<div style={{marginBottom:"20px", fontSize:"22px"}}>
  <div><b>🔧 Index (offline)</b>:
    📂 Repo → ✂️ Chunk → 🧠 Embed → 📦 Store → 🗂 PineCone VectorDB
  </div>

  <div><b>🔎 Query (live RAG)</b>:
    ❓ Query → 🧠 Embed → 🔍 Search → 📑 Context → 🤖 openAI LLM → 💬 Answer
  </div>
</div>
<br/>
      {/* Query input */}

      <div style={{ marginTop: 30 }}>

        <input
          style={{ width: 500, padding: 10 }}
          placeholder="Ask a question about the repo - Offline-Indexed in PineCone vector DB"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button
          style={{
            marginLeft: 10,
            padding: 10,
            background: "blue",
            color: "white"
          }}
          onClick={askQuestion}
          disabled={loading}
        >
          Ask
        </button>

      </div>

      {/* Answer pane */}

      <div style={{ marginTop: 40 }}>

        <h3 style={{ color: "green" }}>
          Answer
        </h3>

        <pre
          style={{
            background: "#f5f5f5",
            padding: 20,
            whiteSpace: "pre-wrap"
          }}
        >
          {answer}
        </pre>

      </div>

      {/* Logs pane */}

      <div style={{ marginTop: 40 }}>

        <h3 style={{ color: "green" }}>
          Serverless Instances' Log
        </h3>

        <pre
          style={{
            background: "#eee",
            padding: 20,
            height: 200,
            overflow: "auto"
          }}
        >
          {logs.join("\n")}
        </pre>

      </div>

    </div>
  )
}
