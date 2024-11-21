import { ConfigDocument, ConfigModel } from "./model"

export async function getConfig(key: string): Promise<ConfigDocument> {
  return ConfigModel.findOne({ key }).orFail()
}

export async function getConfigs(): Promise<ConfigDocument[]> {
  return ConfigModel.find()
}

export async function setConfig(key: string, value: string): Promise<ConfigDocument> {
  return ConfigModel.findOneAndUpdate({ key }, { $set: { value } }, { upsert: true, new: true })
}

export async function unsetConfig(key: string): Promise<void> {
  await ConfigModel.deleteOne({ key })
}
