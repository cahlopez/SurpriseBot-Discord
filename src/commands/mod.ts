import { commands } from "../../bot.ts";
import { Command } from "../types/commands.ts";

export function createCommand(command: Command) {
  commands.set(command.name, command);
}
