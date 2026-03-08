export function logEvent(event:string){

  const logs = JSON.parse(sessionStorage.getItem("logs") || "[]")

  logs.push({
    time:new Date().toLocaleTimeString(),
    event
  })

  sessionStorage.setItem("logs",JSON.stringify(logs))
}

export const log = (event: string) => logEvent

export function getLogs() { const retLogs = (sessionStorage.getItem("logs") || "..."); 
return typeof retLogs === "string" ? JSON.parse(retLogs) : retLogs
}