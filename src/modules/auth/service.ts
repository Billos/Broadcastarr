import { AuthDocument, AuthModel, AuthType } from "./model"

// Simple CRUD operations for the Config model.

export async function getAuth(value: string): Promise<AuthDocument> {
  return AuthModel.findOne({ value }).orFail()
}

export async function createAuth(authType: AuthType, value: string, roles: string[]): Promise<AuthDocument> {
  return AuthModel.create({ authType, value, roles })
}

export async function getAuths(): Promise<AuthDocument[]> {
  return AuthModel.find()
}

export async function deleteAuth(authType: AuthType, value: string): Promise<void> {
  await AuthModel.findOneAndDelete({ authType, value }).orFail()
}

export async function addRolesToAuth(authType: AuthType, value: string, roles: string[]): Promise<AuthDocument> {
  return AuthModel.findOneAndUpdate(
    { authType, value },
    { $addToSet: { roles } },
    { returnDocument: "after", runValidators: true },
  ).orFail()
}

export async function deleteRolesFromAuth(authType: AuthType, value: string, roles: string[]): Promise<AuthDocument> {
  return AuthModel.findOneAndUpdate({ authType, value }, { $pull: { roles } }, { returnDocument: "after", runValidators: true }).orFail()
}
