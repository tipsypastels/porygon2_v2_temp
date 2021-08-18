import { PlugCt_Score } from '@prisma/client';
import { GuildMember } from 'discord.js';
import { db } from 'porygon/core';
import { CtConfig } from './shared';

const table = db.plugCt_Score;

export enum CtRoleState {
  Yes = '✅ Yes.',
  No = '❌ No.',
  WillRemove = '🕒 Yes. Will be removed next tick due to decreasing score.',
  WillAdd = '🕒 No. Will be added next tick due to increasing score.',
}

export interface CtScoreSummary {
  score: number;
  state: CtRoleState;
}

export async function ctIncrementScore(member: GuildMember, amount: number) {
  await db.$executeRaw`
      INSERT INTO 
        "public"."PlugCt_Score" ("userId", "pointsThisCycle")
      VALUES 
        (${member.id}, ${amount})
      ON CONFLICT ON CONSTRAINT 
        "PlugCt_Score_pkey" 
      DO UPDATE
      SET "pointsThisCycle" = (
        "PlugCt_Score"."pointsThisCycle" + "excluded"."pointsThisCycle"
      )
  `;
}

export async function ctFetchSummary(member: GuildMember): Promise<CtScoreSummary> {
  const score = await fetchScore(member);
  const state = roleState(hasRole(member), aboveThreshold(score));

  return { score, state };
}

function fetchScore(member: GuildMember) {
  return fetch(member).then(sum);
}

function fetch(member: GuildMember) {
  return table.findFirst({ where: { userId: member.id } });
}

function sum(entry: PlugCt_Score | null) {
  return entry ? entry.pointsThisCycle + entry.pointsLastCycle : 0;
}

function roleState(hasRole: boolean, aboveThreshold: boolean) {
  if (hasRole && aboveThreshold) return CtRoleState.Yes;
  if (hasRole && !aboveThreshold) return CtRoleState.WillRemove;
  if (!hasRole && aboveThreshold) return CtRoleState.WillAdd;
  return CtRoleState.No;
}

function hasRole(member: GuildMember) {
  return member.roles.cache.has(CtConfig.roleId);
}

function aboveThreshold(points: number) {
  return points >= CtConfig.threshold;
}
