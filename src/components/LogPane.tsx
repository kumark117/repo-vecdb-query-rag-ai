"use client"

import { useEffect,useState } from "react"

export default function LogPane(){

  const [logs,setLogs] = useState([])

  useEffect(()=>{

    const stored = JSON.parse(sessionStorage.getItem("logs") || "[]")

    setLogs(stored)

  },[])

  return(

    <div style={{
      borderRight:"1px solid #ddd",
      padding:"20px",
      background:"#f7f7f7",
      fontFamily:"monospace"
    }}>

      <h2 style={{color:"green"}}>
        Log of Serverless Instance Functions, saved in sessionStorage
      </h2>

      <div style={{marginTop:"15px"}}>

        {logs.map((l:any,i)=>(
          <div key={i}>
            {l.time} — {l.event}
          </div>
        ))}

      </div>

    </div>

  )

}