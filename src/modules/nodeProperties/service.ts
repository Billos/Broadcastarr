import { NodePropertiesDocument, NodePropertiesModel } from "./model"

// Create node data
export async function setNodeProperty(uuid: string, type: string, key: string, value: string): Promise<NodePropertiesDocument> {
  return NodePropertiesModel.findOneAndUpdate({ uuid, key }, { $set: { type, value } }, { upsert: true, new: true })
}

// Get node data
export async function getNodeProperty(uuid: string, key: string): Promise<NodePropertiesDocument> {
  return NodePropertiesModel.findOne({ uuid, key }).orFail()
}

export async function getNodePropertiesByType(type: string): Promise<NodePropertiesDocument[]> {
  return NodePropertiesModel.find({ type })
}

// Get key node data
export async function getNodeProperties(uuid: string, key: string): Promise<NodePropertiesDocument[]> {
  return NodePropertiesModel.find({ uuid, key })
}

export async function deleteNodeProperty(uuid: string, key: string): Promise<void> {
  await NodePropertiesModel.deleteOne({ uuid, key })
}

export async function deleteNodeProperties(uuid: string): Promise<void> {
  await NodePropertiesModel.deleteMany({ uuid })
}
