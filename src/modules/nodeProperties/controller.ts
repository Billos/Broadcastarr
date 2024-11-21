import { NodePropertiesDocument } from "./model"
import * as NodePropertiesService from "./service"
import env from "../../config/env"

export async function setNodeProperty(type: string, key: string, value: string): Promise<NodePropertiesDocument> {
  return NodePropertiesService.setNodeProperty(env.nodeUuid, type, key, value)
}

// export async function getNodeProperty(key: string): Promise<NodePropertiesDocument> {
//   return NodePropertiesService.getNodeProperty(env.nodeUuid, key)
// }

// export async function getNodeProperties(key: string): Promise<NodePropertiesDocument[]> {
//   return NodePropertiesService.getNodeProperties(env.nodeUuid, key)
// }

export async function getNodePropertiesByType(type: string): Promise<NodePropertiesDocument[]> {
  return NodePropertiesService.getNodePropertiesByType(type)
}

export async function deleteNodeProperty(key: string): Promise<void> {
  return NodePropertiesService.deleteNodeProperty(env.nodeUuid, key)
}

export async function deleteNodeProperties(): Promise<void> {
  return NodePropertiesService.deleteNodeProperties(env.nodeUuid)
}
