import express, { Request } from "express"

import broadcastRouter from "./broadcast"
import categoryRouter from "./category"
import groupRouter from "./group"
import indexerRouter from "./indexer"
import monitorRouter from "./monitor"
import { CategoryController } from "../../modules/category"
import { IndexerController } from "../../modules/indexer"
import { UUIDController } from "../../modules/uuid"
import Params from "../types"

const router = express.Router()

// Middleware that checks the api key is valid
router.use("/", async (req, res, next) => {
  const apiKey = await UUIDController.getUUID()
  if (req?.query?.apiKey !== apiKey.uuid) {
    res.status(401).send("Invalid api key")
    return
  }
  return next()
})

// Quick middleware to check that indexer param is valid and category param is valid
router.use("/", async (req: Request<Partial<Params>>, res, next) => {
  if (req.params.indexer) {
    await IndexerController.getIndexer(req.params.indexer)
  }
  if (req.params.category) {
    await CategoryController.getCategory(req.params.category)
  }
  return next()
})

router.use("/broadcast", broadcastRouter)
router.use("/category", categoryRouter)
router.use("/group", groupRouter)
router.use("/indexer", indexerRouter)
router.use("/monitor", monitorRouter)

export default router
