import express from "express"

import { NodePropertiesController } from "../../modules/nodeProperties"

const router = express.Router()

router.get("/openedUrl", async (req, res) => {
  const properties = await NodePropertiesController.getNodePropertiesByType("pages")

  // Construction of the return object being Record<nodeUuid, Record<browserUuid, string[]>>
  const urlsRecord: Record<string, Record<string, string[]>> = {}
  for (const { uuid, key, value, createdAt } of properties) {
    const urls = value.split(",")
    urlsRecord[uuid] = urlsRecord[uuid] || {}
    urlsRecord[uuid][`${createdAt.toLocaleTimeString()}-${key}`] = urls
  }

  res.send(urlsRecord)
})

export default router
