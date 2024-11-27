import { Bootstrapper } from "./bootstrapper"
import { ConfigBootstrapper } from "./config"
import { EmojiBootstrapper } from "./emoji"
import { GroupsBootstrapper } from "./groups"
import { IndexersBootstrapper } from "./indexers"
import { PublishersBootstrapper } from "./publishers"
import { ReleasersBootstrapper } from "./releasers"
import { RolesBootstrapper } from "./roles"

const bootstrappers = [
  new IndexersBootstrapper(),
  new ConfigBootstrapper(),
  new GroupsBootstrapper(),
  new EmojiBootstrapper(),
  new ReleasersBootstrapper(),
  new PublishersBootstrapper(),
  new RolesBootstrapper(),
] as Bootstrapper[]

export { bootstrappers }
