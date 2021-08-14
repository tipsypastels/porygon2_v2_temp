"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Row = void 0;
const time_1 = require("support/time");
const discord_js_1 = require("discord.js");
const MAX_LISTEN_TIME = time_1.Minutes(15);
class Row extends discord_js_1.MessageActionRow {
    constructor() {
        super(...arguments);
        this.buttonHandlers = new Map();
        this.selectHandlers = new Map();
    }
    addButton(builder) {
        return this.build(discord_js_1.MessageButton, builder, this.buttonHandlers);
    }
    addSelect(builder) {
        return this.build(discord_js_1.MessageSelectMenu, builder, this.selectHandlers);
    }
    build(klass, builder, handlers) {
        const customId = this.createCustomId();
        const component = new klass();
        component.setCustomId(customId);
        let handler;
        function setHandler(to) {
            handler = to;
        }
        builder(component, setHandler);
        if (handler) {
            handlers.set(customId, handler);
        }
        return this.addComponents(component);
    }
    createCustomId() {
        return `${Math.random()}`;
    }
    listen(target, opts = {}) {
        const collector = this.createCollector(target, opts);
        collector.on('collect', async (i) => {
            await this.collect(i);
        });
        return collector;
    }
    createCollector(target, opts) {
        const time = opts.time ?? MAX_LISTEN_TIME;
        const filter = (i) => {
            let valid = this.hasCustomId(i.customId);
            if (opts.filter)
                valid && (valid = opts.filter(i));
            return valid;
        };
        return target.createMessageComponentCollector({ time, filter });
    }
    collect(intr) {
        if (intr.isButton()) {
            return this.collectFrom(intr, this.buttonHandlers);
        }
        else if (intr.isSelectMenu()) {
            return this.collectFrom(intr, this.selectHandlers);
        }
    }
    collectFrom(intr, handlers) {
        const handler = handlers.get(intr.customId);
        const component = this.findByCustomId(intr.customId);
        if (!component || !handler) {
            return;
        }
        const detatch = this.createDetatchFn(intr.customId, handlers);
        return handler({ intr, component, detatch });
    }
    hasCustomId(customId) {
        return this.buttonHandlers.has(customId) || this.selectHandlers.has(customId);
    }
    findByCustomId(customId) {
        const index = this.findIndexByCustomId(customId);
        if (index !== -1)
            return this.components[index];
    }
    findIndexByCustomId(customId) {
        return this.components.findIndex((c) => c.customId === customId);
    }
    createDetatchFn(customId, handlers) {
        return function () {
            handlers.delete(customId);
        };
    }
}
exports.Row = Row;
