import { AuthDocument, AuthModel } from "./model"

// Simple CRUD operations for the Config model.

export async function getAuth(value: string): Promise<AuthDocument> {
  return AuthModel.findOne({ value }).orFail()
}

export async function createAuth(type: string, value: string, roles: string[]): Promise<AuthDocument> {
  return AuthModel.create({ type, value, roles })
}

export async function getAuths(): Promise<AuthDocument[]> {
  return AuthModel.find()
}

export async function deleteAuth(type: string, value: string): Promise<void> {
  await AuthModel.findOneAndDelete({ type, value }).orFail()
}

export async function addRolesToAuth(type: string, value: string, roles: string[]): Promise<AuthDocument> {
  return AuthModel.findOneAndUpdate({ type, value }, { $addToSet: { roles } }, { new: true }).orFail()
}

export async function deleteRolesFromAuth(type: string, value: string, roles: string[]): Promise<AuthDocument> {
  return AuthModel.findOneAndUpdate({ type, value }, { $pull: { roles } }, { new: true }).orFail()
}
