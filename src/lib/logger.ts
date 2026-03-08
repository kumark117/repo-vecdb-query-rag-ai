export function logEvent(event:string){

  const logs = JSON.parse(sessionStorage.getItem("logs") || "[]")

  logs.push({
    time:new Date().toLocaleTimeString(),
    event
  })

  sessionStorage.setItem("logs",JSON.stringify(logs))
}
