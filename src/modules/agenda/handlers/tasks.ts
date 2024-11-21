import { handler as DeleteBroadcast } from "./deleteBroadcast"
import { handler as GrabBroadcastStream } from "./grabBroadcastStream"
import { handler as IndexCategory } from "./indexCategory"
import { handler as PublishCategory } from "./publishCategory"
import { handler as PublishGroup } from "./publishGroup"
import { handler as ReleaseBroadcast } from "./releaseBroadcast"
import { handler as UpdateCategoryChannelName } from "./updateCategoryChannelName"

const Handlers = {
  DeleteBroadcast,
  GrabBroadcastStream,
  IndexCategory,
  PublishCategory,
  PublishGroup,
  ReleaseBroadcast,
  UpdateCategoryChannelName,
}

export { Handlers }
