import express from "express"
import proxy from "express-http-proxy"
import NodeCache from "node-cache"

import { BroadcastController, BroadcastDocument } from "../modules/broadcast"

const router = express.Router()

router.get("/test", async (req, res) => {
  res.send("Test")
})

// Stream parts
router.use("/broadcast/:broadcastId/", async (req, res, next) => {
  // Redirect to the first stream
  const { broadcastId } = req.params
  const broadcast = await BroadcastController.getBroadcast(broadcastId)
  if (!broadcast) {
    res.status(404).send("Broadcast not found")
    return
  }
  if (!broadcast.streams || !broadcast.streams.length) {
    res.status(404).send("No stream found")
    return
  }
  // Set the channel in the context
  res.locals.broadcast = broadcast
  next()
})

const cache = new NodeCache({ stdTTL: 20, checkperiod: 60 })

// Cache middleware
router.use("/broadcast/:broadcastId/", async (req, res, next) => {
  const { broadcastId } = req.params
  const key = `${broadcastId}${req.url}`
  if (cache.has(key)) {
    const cached = cache.get(key)
    return res.send(cached)
  }
  return next()
})

// /broadcast/:broadcastId/stream redirects to the first stream
router.use("/broadcast/:broadcastId/stream", async (req, res) => {
  const [{ url }] = (res.locals.broadcast as BroadcastDocument).streams
  const urlObj = new URL(url)
  res.redirect(`/stream/broadcast/${req.params.broadcastId}${urlObj.pathname}${urlObj.search}`)
})

router.use("/broadcast/:broadcastId/", async (req, res, next) => {
  const [{ url, referer }] = (res.locals.broadcast as BroadcastDocument).streams
  return proxy(url, {
    proxyReqOptDecorator: (proxyReqOpts) => {
      proxyReqOpts.headers.referer = referer
      return proxyReqOpts
    },
    userResDecorator: (proxyRes, proxyResData, userReq) => {
      // Only store .ts queries
      if (userReq.url.includes(".ts")) {
        const key = `${req.params.broadcastId}${userReq.url}`
        cache.set(key, proxyResData)
      }
      return proxyResData
    },
  })(req, res, next)
})

export default router
