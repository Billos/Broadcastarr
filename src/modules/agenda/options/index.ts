import { DeleteBroadcastOptions } from "./deleteBroadcast"
import { GrabBroadcastStreamOptions } from "./grabBroadcastStream"
import { IndexCategoryOptions } from "./indexCategory"
import { PublishCategoryOptions } from "./publishCategory"
import { PublishGroupOptions } from "./publishGroup"
import { ReleaseBroadcastOptions } from "./releaseBroadcast"
import { UpdateCategoryChannelNameOptions } from "./updateCategoryChannelName"
import { Tasks } from "../tasks"

export {
  DeleteBroadcastOptions,
  GrabBroadcastStreamOptions,
  IndexCategoryOptions,
  PublishCategoryOptions,
  PublishGroupOptions,
  ReleaseBroadcastOptions,
  UpdateCategoryChannelNameOptions,
}

// Define Tasks => Options mapping
type TaskOptionsMapping = {
  [Tasks.PublishCategory]: PublishCategoryOptions;
  [Tasks.IndexCategory]: IndexCategoryOptions;
  [Tasks.GrabBroadcastStream]: GrabBroadcastStreamOptions;
  [Tasks.ReleaseBroadcast]: ReleaseBroadcastOptions;
  [Tasks.PublishGroup]: PublishGroupOptions;
  [Tasks.UpdateCategoryChannelName]: UpdateCategoryChannelNameOptions;
  [Tasks.DeleteBroadcast]: DeleteBroadcastOptions;
}

export type TaskOptions<T extends Tasks> = TaskOptionsMapping[T]
