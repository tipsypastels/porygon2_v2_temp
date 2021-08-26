import { Embed, IntoEmbed } from 'porygon/embed';
import { BansLogConfig, UnbansLogConfig } from './events/ban_unban';
import { DeletionsLogConfig } from './events/deletion';
import { JoinsLogConfig } from './events/join';
import { LeavesLogConfig, KicksLogConfig } from './events/leave_kick';
import { LogOutputChannel } from './output_channel';

export interface LogConfig<ExtraDetails extends string> {
  to: LogOutputChannel;
  details?: ExtraDetails[] | 'all';
}

export type LogEventsConfig = {
  log: Partial<{
    joins: JoinsLogConfig;
    leaves: LeavesLogConfig;
    kicks: KicksLogConfig;
    bans: BansLogConfig;
    unbans: UnbansLogConfig;
    deletions: DeletionsLogConfig;
  }>;
};

export class LogEmbed<ExtraDetails extends string> {
  private enabledDetails: Set<ExtraDetails> | 'all';
  private embed = new Embed();

  constructor(details: ExtraDetails[] | 'all' | undefined) {
    this.enabledDetails = details === 'all' ? details : new Set(details ?? []);
  }

  toEmbed() {
    return this.embed;
  }

  base(into: IntoEmbed) {
    this.embed.merge(into);
    return this;
  }

  detail(detail: ExtraDetails, into: IntoEmbed) {
    if (this.has(detail)) this.embed.merge(into);
    return this;
  }

  // simpler than Embed#merge/mergeWith, we don't need all their features here

  merge(into: (log: this) => void) {
    into(this);
    return this;
  }

  mergeWith<C extends any[]>(into: (log: this, ...cfg: C) => void, ...cfg: C) {
    into(this, ...cfg);
    return this;
  }

  private has(detail: ExtraDetails) {
    return this.enabledDetails === 'all' || this.enabledDetails.has(detail);
  }
}
