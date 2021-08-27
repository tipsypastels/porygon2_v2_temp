import { CounterTableStat } from './counter';
import { TimeDifferenceStat } from './time_difference';

export const uptime = new TimeDifferenceStat();
export const joinDateSource = new CounterTableStat('member', 'database', 'missing');

export { TimeDifferenceStat };
export { CounterStat, CounterTableStat } from './counter';
export { FailurePercentStat } from './failure_percent';
