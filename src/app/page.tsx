"use client"

import { useState } from "react"
//import { log, getLogs } from "../lib/logger";
//import { useRouter } from "next/navigation";
//import router from "next/router";


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
        Nextjs Repo <i>RAG</i> (→ OpenAI) Explorer, hosted on Vercel
      </h1>
<div style={{marginBottom:"20px", fontSize:"18px"}}>
  AI Repo Search — Retrieval Augmented Generation Demo
  <br />
  .Nextjs .Typescript .PineCone VectorDB .OpenAI - hosted on Vercel (serverless)
</div>
<br/>
<div style={{marginBottom:"20px", fontSize:"20px"}}>
  <div><b>🔧 Index (offline)</b>:
    📂 Repo → ✂️ Chunk → 🧠 Embed → 📦 Store → 🗂 PineCone
  </div>

  <div><b>🔎 Query (live RAG)</b>:
    ❓ Query → 🧠 Embed → 🔍 Search → 📑 Context → 🤖 OpenAI LLM → 💬 Answer
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
&nbsp; &nbsp; &nbsp;
        <button
          style={{
          padding: "10px 18px",
          background: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginTop: "20px"
          }}
          onClick={askQuestion}
          disabled={loading}
        >
          Ask
        </button>
&nbsp; &nbsp; &nbsp;
        <button
        onClick={() => window.location.href = "/how-it-works"}
        style={{
          padding: "10px 18px",
          background: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginTop: "20px"
        }}
      >
        How It Works ?!
      </button>

      </div>

      {/* Answer pane */}

      <div style={{ marginTop: 40 }}>

        <h3 style={{ color: "green" }}>
          Answer
        </h3>

        <pre
          style={{
            background: "skyblue",
            color: "black",
            padding: 20,
            whiteSpace: "pre-wrap",
            fontSize: 16,
            borderRadius: "10px"
          }}
        >
          {answer}
        </pre>

      </div>

      {/* Logs pane */}

      <div style={{ marginTop: 40 }}>

        <h3 style={{ color: "green" }}>
         Log
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
