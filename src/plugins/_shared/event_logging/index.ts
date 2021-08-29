import { EventProxy } from 'porygon/plugin';
import { LogEventsConfig } from './config';
import { logBans, logUnbans } from './events/ban_unban';
import { logDeletions } from './events/deletion';
import { logJoins } from './events/join';
import { logLeavesKicks } from './events/leave_kick';

export * from './join_date_cache';
export function logEvents(events: EventProxy, cfg: LogEventsConfig) {
  const { joins, leaves, kicks, bans, unbans, deletions } = cfg.log;

  if (joins) logJoins(events, joins);
  if (leaves || kicks) logLeavesKicks(events, leaves, kicks, cfg.getFallbackJoinDate);
  if (bans) logBans(events, bans);
  if (unbans) logUnbans(events, unbans);
  if (deletions) logDeletions(events, deletions);
}
