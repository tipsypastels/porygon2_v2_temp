"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromMember = exports.fromUser = exports.Embed = void 0;
const discord_js_1 = require("discord.js");
const assets_1 = require("./assets");
class Embed extends discord_js_1.MessageEmbed {
    merge(into, ...args) {
        if (into) {
            typeof into === 'function' ? into(this, ...args) : into.intoEmbed(this, ...args);
        }
        return this;
    }
    poryThumb(thumb) {
        return this.setThumbnail(assets_1.PORY_ASSETS.get(thumb).url);
    }
    poryColor(color) {
        return this.setColor(COLORS[color]);
    }
    clearImage() {
        this.image = null;
        return this;
    }
    addInlineField(name, value) {
        return this.addField(name, value, true);
    }
}
exports.Embed = Embed;
const COLORS = {
    ok: 0x7fc13a,
    info: 0x00c17d,
    error: 0xff0041,
    danger: 0xff8931,
    warning: 0xfdbe4a,
};
function fromUser(user, opts = {}) {
    if (user instanceof discord_js_1.GuildMember) {
        return fromUser(user.user, opts);
    }
    const { username } = user;
    const name = opts.withDisc ? `${username}#${user.discriminator}` : username;
    return [name, user.avatarURL() ?? undefined, opts.url];
}
exports.fromUser = fromUser;
function fromMember(member, opts = {}) {
    const { displayName: dn } = member;
    const name = opts.withDisc ? `${dn}#${member.user.discriminator}` : dn;
    return [name, member.user.avatarURL() ?? undefined, opts.url];
}
exports.fromMember = fromMember;
