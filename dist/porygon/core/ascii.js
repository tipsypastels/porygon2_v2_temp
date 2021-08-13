"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const dev_1 = require("porygon/dev");
if (!dev_1.DEV) {
    const LINES = `
   ____   ___   ____   __ __   ____   ___   ____
  |    \\ /   \\ |    \\ |  |  | /    | /   \\ |    \\
  |  o  )     ||  D  )|  |  ||   __||     ||  _  |
  |   _/|  O  ||    / |  ~  ||  |  ||  O  ||  |  |
  |  |  |     ||    \\ |___, ||  |_ ||     ||  |  |
  |  |  |     ||  .  \\|     ||     ||     ||  |  |
  |__|   \\___/ |__|\\_||____/ |___,_| \\___/ |__|__|
  `.split('\n');
    for (const line of LINES) {
        console.log(colors_1.default.rainbow(line));
    }
}
