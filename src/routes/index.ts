import express from "express"

import apiRouter from "./api"
import streamRouter from "./stream"
import mainLogger from "../utils/logger"

const app = express()
app.get("/", (req, res) => {
  const logger = mainLogger.getSubLogger({ name: "Server", prefix: [""] })
  logger.info("Hello World")
  res.send("Hello World!")
})

app.use("/stream", streamRouter)
app.use("/api", apiRouter)

export default app
