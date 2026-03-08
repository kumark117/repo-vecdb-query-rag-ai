"use client"

import { useState } from "react"

export default function QueryPane(){

  const [query,setQuery] = useState("")
  const [answer,setAnswer] = useState("")

  async function ask(){

    const res = await fetch("/api/query",{
      method:"POST",
      body:JSON.stringify({query})
    })

    const data = await res.json()

    setAnswer(data.answer)

  }

  return(

    <div style={{padding:"20px"}}>

      <h2 style={{color:"green"}}>
        Ask Questions About the Repo
      </h2>

      <div style={{marginTop:"15px"}}>

        <input
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          placeholder="Ask about the repository..."
          style={{
            width:"60%",
            padding:"10px",
            marginRight:"10px"
          }}
        />

        <button
          onClick={ask}
          style={{
            backgroundColor:"#0070f3",
            color:"white",
            padding:"10px 20px",
            border:"none",
            cursor:"pointer"
          }}
        >
          Ask
        </button>

      </div>

      <div style={{marginTop:"30px"}}>
        {answer}
      </div>

    </div>

  )

}