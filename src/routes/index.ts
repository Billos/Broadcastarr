import express from "express"

import mainLogger from "../utils/logger"
import apiRouter from "./api"
import streamRouter from "./stream"

const app = express()
app.get("/", (_req, res) => {
  const logger = mainLogger.child({ name: "Server", func: "Hello World" })
  logger.info("Hello World")
  res.send("Hello World!")
})

app.use("/stream", streamRouter)
app.use("/api", apiRouter)

export default app
