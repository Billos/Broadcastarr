import { CategoryController } from "../modules/category"
import { GroupController } from "../modules/group"
import mainLogger from "../utils/logger"
import { Bootstrapper } from "./bootstrapper"

type Group = {
  country?: string
  name: string
}

export class GroupsBootstrapper extends Bootstrapper {
  public async bootstrap(): Promise<void> {
    const logger = mainLogger.child({ name: "GroupsBootstrapper", func: "bootstrap" })
    logger.info("Bootstrapping groups")
    // group will be set as "CategoryA:groupA,countryB*groupB,groupC|CategoryB:countryD*groupD,groupE|CategoryA:groupF"
    const envGroups: Record<string, Set<Group>> = {}
    // const envGroups: Record<string, Set<string>> = {}
    if (!process.env.GROUPS) {
      logger.info("No groups to bootstrap")
      return
    }
    for (const categoryStr of process.env.GROUPS.split("|")) {
      const [category, groupsStr] = categoryStr.split(":")

      const elements = groupsStr
        .split(",")
        .map((element) => element.trim())
        .filter((element) => element.length > 0)
      if (!envGroups[category]) {
        envGroups[category] = new Set()
      }

      for (const element of elements) {
        if (element.includes("*")) {
          const [country, name] = element.split("*")
          envGroups[category].add({ country, name })
        } else {
          envGroups[category].add({ name: element })
        }
      }
    }

    logger.info("Creating categories and groups")
    // Once the groups are parsed, we create them in the db if they don't already exist
    for (const [category, groups] of Object.entries(envGroups) as [string, Set<Group>][]) {
      const groupNames = Array.from(groups).map((group) => group.name)
      logger.info(`Creating category ${category} with groups ${groupNames.join(", ")}`)
      // Assert that category exists
      try {
        await CategoryController.getCategory(category)
        logger.info(`Category ${category} already exists`)
      } catch (error) {
        logger.info(`Creating category ${category}`)
        await CategoryController.createCategory(category)
      }
      for (const { name, country } of groups) {
        try {
          await GroupController.createGroup({ name, category, country }, true)
          logger.info(`Group ${name} in category ${category} created`)
        } catch (error) {
          // Nothing to do, the group already exists
          logger.info(`Group ${name} in category ${category} already exists, setting it as active if it was not`)
          await GroupController.updateActive({ name, category, country }, true)
        }
      }
    }
  }
}
