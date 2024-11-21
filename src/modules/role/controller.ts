import { RoleDocument } from "./model"
import * as RoleService from "./service"

export async function hasAbility(roles: string[], ability: string): Promise<boolean> {
  return RoleService.hasAbility(roles, ability)
}

export async function getRole(name: string): Promise<RoleDocument> {
  return RoleService.getRole(name)
}

export async function createRole(name: string, abilities: string[]): Promise<RoleDocument> {
  return RoleService.createRole(name, abilities)
}

export async function getRoles(): Promise<RoleDocument[]> {
  return RoleService.getRoles()
}

export async function addAbilities(name: string, abilities: string[]): Promise<RoleDocument> {
  return RoleService.addAbilities(name, abilities)
}

export async function deleteAbilities(name: string, abilities: string[]): Promise<RoleDocument> {
  return RoleService.deleteAbilities(name, abilities)
}
