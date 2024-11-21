import { deleteBroadcast } from "./deleteBroadcast"
import {
  cancelGrabBroadcastStream,
  grabBroadcastStream,
  renewGrabBroadcastStream,
} from "./grabBroadcastStream"
import { cancelIndexCategory, indexCategory, renewIndexCategory } from "./indexCategory"
import { publishCategory } from "./publishCategory"
import { publishGroup } from "./publishGroup"
import { cancelReleaseBroadcast, releaseBroadcast } from "./releaseBroadcast"
import { updateCategoryChannelName } from "./updateCategoryChannelName"

const Triggers = {
  deleteBroadcast,
  grabBroadcastStream,
  cancelGrabBroadcastStream,
  renewGrabBroadcastStream,
  indexCategory,
  cancelIndexCategory,
  renewIndexCategory,
  releaseBroadcast,
  cancelReleaseBroadcast,
  publishCategory,
  publishGroup,
  updateCategoryChannelName,
}

export { Triggers }
