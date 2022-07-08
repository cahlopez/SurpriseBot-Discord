import { Command } from "./command";
import { Ping } from "./commands/ping";
import { Wordle } from "./commands/wordle";

export const Commands: Command[] = [Ping, Wordle]; 