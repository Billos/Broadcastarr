import { Agenda, IJobParameters, Job } from "@hokify/agenda"

import { TaskOptions } from "./options"
import { Tasks } from "./tasks"
import env from "../../config/env"
import onExit from "../../utils/onExit"

const agenda = new Agenda({ db: { address: `${env.mongo.url}/${env.mongo.agendaDb}` } })

export default agenda

onExit(async () => {
  await agenda.stop()
})

export async function schedule<T extends Tasks>(when: Date | string, name: T, data: TaskOptions<T>): Promise<Job<TaskOptions<T>>> {
  return agenda.schedule<TaskOptions<T>>(when, name, data)
}

export async function now<T extends Tasks>(name: T, data: TaskOptions<T>): Promise<Job<TaskOptions<T>>> {
  return agenda.now<TaskOptions<T>>(name, data)
}

export async function every<T extends Tasks>(interval: string, name: T, data: TaskOptions<T>): Promise<Job<TaskOptions<T>>> {
  return agenda.every(interval, name, data)
}

export async function cancel<T extends Tasks>(name: T, params: Partial<IJobParameters<Partial<TaskOptions<T>>>>): Promise<number> {
  const flatten = Object.entries(params.data).reduce((acc, [key, value]) => ({ ...acc, [`data.${key}`]: value }), {} as Record<string, unknown>)
  return agenda.cancel({ name, ...params, ...flatten })
}

export async function jobs<T extends Tasks>(name: T, params: Partial<IJobParameters<Partial<TaskOptions<T>>>>): Promise<Job<TaskOptions<T>>[]> {
  // params.data.categoryId must become params.["data.categoryId"] and so on for all keys of data
  const flatten = Object.entries(params.data).reduce((acc, [key, value]) => ({ ...acc, [`data.${key}`]: value }), {} as Record<string, unknown>)
  const query = { name, ...params, ...flatten }
  delete query.data
  return agenda.jobs(query) as unknown as Job<TaskOptions<T>>[]
}
