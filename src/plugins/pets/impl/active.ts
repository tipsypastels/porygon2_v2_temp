import { Snowflake } from 'discord.js';
import { db } from 'porygon/core';

type User = { id: Snowflake };

export async function activatePetsBy({ id }: User) {
  await db.$executeRaw`
    UPDATE 
      "public"."PkgPets_Pet"
    SET
      "active" = TRUE
    WHERE
      "userId" = ${id}
  `;
}

export async function deactivatePetsBy({ id }: User) {
  await db.$executeRaw`
    UPDATE 
      "public"."PkgPets_Pet"
    SET
      "active" = FALSE
    WHERE
      "userId" = ${id}
  `;
}
