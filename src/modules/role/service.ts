import { RoleDocument, RoleModel } from "./model"

export async function hasAbility(roles: string[], ability: string): Promise<boolean> {
  const aggregate = await RoleModel.aggregate([
    // Match the roles
    { $match: { name: { $in: roles } } },
    // Merge the abilities
    { $unwind: "$abilities" },
    // Match the ability
    { $match: { abilities: ability } },
  ])

  if (aggregate?.length > 0) {
    return true
  }

  return false
}

export async function getRole(name: string): Promise<RoleDocument> {
  return RoleModel.findOne({ name }).orFail()
}

export async function createRole(name: string, abilities: string[]): Promise<RoleDocument> {
  return RoleModel.create({ name, abilities })
}

export async function getRoles(): Promise<RoleDocument[]> {
  return RoleModel.find()
}

export async function addAbilities(name: string, abilities: string[]): Promise<RoleDocument> {
  return RoleModel.findOneAndUpdate({ name }, { $addToSet: { abilities } }, { new: true }).orFail()
}

export async function deleteAbilities(name: string, abilities: string[]): Promise<RoleDocument> {
  return RoleModel.findOneAndUpdate({ name }, { $pull: { abilities } }, { new: true }).orFail()
}
