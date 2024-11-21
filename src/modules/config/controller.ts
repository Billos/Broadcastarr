import { ConfigDocument } from "./model"
import * as ConfigService from "./service"

export async function getConfig(key: string): Promise<ConfigDocument> {
  return ConfigService.getConfig(key)
}

export async function getConfigs(): Promise<ConfigDocument[]> {
  return ConfigService.getConfigs()
}

export async function getNumberConfig(key: string): Promise<number> {
  const config = await ConfigService.getConfig(key)
  const value = parseInt(config.value, 10)
  if (Number.isNaN(value)) {
    throw new Error("Invalid number value")
  }
  return value
}

export async function setConfig(key: string, value: string): Promise<ConfigDocument> {
  return ConfigService.setConfig(key, value)
}

export async function unsetConfig(key: string): Promise<void> {
  return ConfigService.unsetConfig(key)
}
