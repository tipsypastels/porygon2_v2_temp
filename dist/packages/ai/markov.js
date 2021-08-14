"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Markov = void 0;
const fs_1 = require("fs");
const array_1 = require("support/array");
class Markov {
    constructor({ name, fallback, order = 3 }) {
        this.starts = [];
        this.states = [];
        this.possibilities = {};
        this.file = `.markov/${name}.markov`;
        this.order = order;
        this.fallback = fallback;
        if (fs_1.existsSync(this.file)) {
            this.states = fs_1.readFileSync(this.file, 'utf-8').split('\n');
            this.states.pop(); // remove final newline
            this.train();
        }
        else {
            fs_1.writeFileSync(this.file, '', { flag: 'w' });
            this.states = [];
        }
        this.stream = fs_1.createWriteStream(this.file, { flags: 'a' });
    }
    speak({ chars = 50 } = {}) {
        const start = array_1.random(this.starts);
        let result = start;
        let current = start;
        let next = '';
        for (let i = 0; i < chars - this.order; i++) {
            next = array_1.random(this.possibilities[current] ?? []);
            if (!next) {
                break;
            }
            result += next;
            current = result.substring(result.length - this.order, result.length);
        }
        return result ?? this.fallback;
    }
    learn(state) {
        this.states.push(state);
        this.train();
        this.stream.write(`${state}\n`);
    }
    train() {
        this.possibilities = {};
        for (let i = 0; i < this.states.length; i++) {
            this.starts.push(this.states[i].substring(0, this.order));
            for (let j = 0; j <= this.states[i].length - this.order; j++) {
                const gram = this.states[i].substring(j, j + this.order);
                if (!this.possibilities[gram]) {
                    this.possibilities[gram] = [];
                }
                this.possibilities[gram].push(this.states[i].charAt(j + this.order));
            }
        }
    }
}
exports.Markov = Markov;
