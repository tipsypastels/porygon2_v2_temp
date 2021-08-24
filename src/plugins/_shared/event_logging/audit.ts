import subMinutes from 'date-fns/subMinutes';
import { Guild, GuildAuditLogsEntry, GuildAuditLogsFetchOptions, User } from 'discord.js';
import { bugLogger } from 'porygon/logger';
import { Seconds } from 'support/time';

type Type = GuildAuditLogsFetchOptions['type'];
type Target = {
  user: User;
  guild: Guild;
};

const RETRIES = 5;
const SLEEP = Seconds(5);

// prevents finding the same event twice
// note: in dev, this prevents logs from triggering for multiple fake "guilds",
// such as the kick events for pokecom and pokecomstaf. won't be a problem
// in production.
let lastFind = 0;

export function getKickLog(target: Target) {
  return latest(target, 'MEMBER_KICK');
}

export function getBanLog(target: Target) {
  return latest(target, 'MEMBER_BAN_ADD');
}

export function getUnbanLog(target: Target) {
  return latest(target, 'MEMBER_BAN_REMOVE');
}

// audit logs are completely unreliable and can come in at any time
// because this is used for passive logging and not responding to an interaction
// it's fine to wait a bit for the sake of accuracy, so we retry several times
// if we don't get an event
//
// in particular, bans seem to come in later than unbans and kicks, since the
// latter two usually (but not always) find it on loop 0, whereas ban almost
// never does.
async function latest(target: Target, type: Type) {
  for (let i = 0; i < RETRIES; i++) {
    const log = await get(target, type);

    if (log) {
      bugLogger.info(`Found audit log ${type} after ${i} cycles.`);
      return log;
    }

    if (i < RETRIES - 1) {
      await sleep();
    }
  }
}

async function get(target: Target, type: Type) {
  const { guild, user } = target;
  const logs = await guild.fetchAuditLogs({ type, limit: 1 });

  const entry = logs.entries.first();

  if (entry && isUser(user, entry) && isRecent(entry)) {
    return entry;
  }
}

function isUser(user: User, { target }: GuildAuditLogsEntry) {
  if (!target || !('id' in target)) {
    return;
  }

  return target.id === user.id;
}

function isRecent({ createdTimestamp: ts }: GuildAuditLogsEntry) {
  if (ts >= threeMinutesAgo() && ts > lastFind) {
    lastFind = ts;
    return true;
  }

  return false;
}

function threeMinutesAgo() {
  return subMinutes(new Date(), 3).getTime();
}

function sleep() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, SLEEP);
  });
}
