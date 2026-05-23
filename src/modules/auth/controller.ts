import { AuthDocument, AuthType } from "./model"
import * as AuthService from "./service"

export async function getAuths(): Promise<AuthDocument[]> {
  return AuthService.getAuths()
}

export async function getAuth(value: string): Promise<AuthDocument> {
  return AuthService.getAuth(value)
}

export async function createAuth(type: AuthType, value: string, roles: string[]): Promise<AuthDocument> {
  return AuthService.createAuth(type, value, roles)
}

export async function deleteAuth(type: AuthType, value: string): Promise<void> {
  return AuthService.deleteAuth(type, value)
}

export async function addRolesToAuth(type: AuthType, value: string, roles: string[]): Promise<AuthDocument> {
  return AuthService.addRolesToAuth(type, value, roles)
}

export async function deleteRolesFromAuth(type: AuthType, value: string, roles: string[]): Promise<AuthDocument> {
  return AuthService.deleteRolesFromAuth(type, value, roles)
}
