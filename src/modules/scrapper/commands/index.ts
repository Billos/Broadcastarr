import { CommandDocument } from "../../indexer/commands"
import { AssertGroup } from "./broadcast/AssertGroup"
import { Command } from "./command"
import { ClickCommand } from "./navigation/Click"
import { CounterCommand } from "./navigation/Counter"
import { FillInputCommand } from "./navigation/FillInput"
import { GetValuesCommand } from "./navigation/GetValues"
import { GoToPageCommand } from "./navigation/GoToPage"
import { InterceptResponseCommand } from "./navigation/InterceptResponse"
import { SleepCommand } from "./navigation/Sleep"
import { RunScenarioCommand } from "./scenario/RunScenario"
import { SetValuesCommand } from "./scenario/SetValues"

// Name => Command class mapping
const commandClasses: Record<string, new (...args: any[]) => Command> = {
  // Broadcast
  AssertGroup: AssertGroup,
  // Navigation
  Click: ClickCommand,
  Counter: CounterCommand,
  FillInput: FillInputCommand,
  GetValues: GetValuesCommand,
  GoToPage: GoToPageCommand,
  InterceptResponse: InterceptResponseCommand,
  Sleep: SleepCommand,
  // Scenario
  RunScenario: RunScenarioCommand,
  SetValues: SetValuesCommand,
}

export function generateCommand(command: CommandDocument, name: string): Command {
  if (!command) {
    throw new Error("No command provided")
  }
  if (!command.type) {
    throw new Error("No name provided")
  }
  if (!command.args) {
    throw new Error("No args provided")
  }
  const args = command.args as unknown as any

  const CmdClass = commandClasses[command.type]
  if (!CmdClass) {
    throw new Error(`Command ${command.type} not found`)
  }
  return new CmdClass(name, args, command.next)
}
