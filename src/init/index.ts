import ConfigInitiator from "./config"
import EmojiInitiator from "./emoji"
import GroupsInitiator from "./groups"
import IndexersInitiator from "./indexers"
import Initiator from "./initiator"
import PublishersInitiator from "./publishers"
import ReleasersInitiator from "./releasers"
import RolesInitiator from "./roles"

export default [
  new IndexersInitiator(),
  new ConfigInitiator(),
  new GroupsInitiator(),
  new EmojiInitiator(),
  new ReleasersInitiator(),
  new PublishersInitiator(),
  new RolesInitiator(),
] as Initiator[]
