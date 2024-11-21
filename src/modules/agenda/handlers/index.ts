import { Job } from "@hokify/agenda"

import { handler as DeleteBroadcastHandler } from "./deleteBroadcast"
import {
  onError as GrabBroadcastStreamError,
  handler as GrabBroadcastStreamHandler,
} from "./grabBroadcastStream"
import { handler as IndexCategoryHandler } from "./indexCategory"
import { handler as PublishCategoryHandler } from "./publishCategory"
import { handler as PublishGroupHandler } from "./publishGroup"
import { handler as ReleaseBroadcastHandler } from "./releaseBroadcast"
import { handler as UpdateCategoryChannelNameHandler } from "./updateCategoryChannelName"
import { Tasks } from "../tasks"

type Handler = (job: Job) => Promise<void>

const Handlers: Record<Tasks, Handler> = {
  DeleteBroadcast: DeleteBroadcastHandler,
  GrabBroadcastStream: GrabBroadcastStreamHandler,
  IndexCategory: IndexCategoryHandler,
  PublishCategory: PublishCategoryHandler,
  PublishGroup: PublishGroupHandler,
  ReleaseBroadcast: ReleaseBroadcastHandler,
  UpdateCategoryChannelName: UpdateCategoryChannelNameHandler,
}

type ErrorHandler = (error: Error, job: Job) => Promise<boolean>

const ErrorHandlers: Partial<Record<Tasks, ErrorHandler>> = {
  GrabBroadcastStream: GrabBroadcastStreamError,
}

export { Handlers, ErrorHandlers }
