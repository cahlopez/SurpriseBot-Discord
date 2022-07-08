"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = void 0;
const ping_1 = require("./commands/ping");
const wordle_1 = require("./commands/wordle");
exports.Commands = [ping_1.Ping, wordle_1.Wordle];
