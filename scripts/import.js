// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */

const { PrismaClient } = require('@prisma/client');
const { readFile } = require('fs/promises');

const db = new PrismaClient();

async function main() {
  await db.$connect();
  await Promise.all([importPets(), importFc(), importRoles()]);

  console.log("We're done!");
}

main();

async function importPets() {
  console.log('Importing pets');

  await db.plugPets_Pet.deleteMany();

  const entries = await read('pets');

  const promises = entries.map(async ([_, __, userId, url]) => {
    const path = url.replace('https://cdn.discordapp.com/attachments/', '');
    await db.plugPets_Pet.create({ data: { userId, path } });
  });

  await Promise.all(promises);
}

async function importFc() {
  console.log('Importing friend codes');

  await db.plugFc_Codes.deleteMany();

  const entries = await read('fc');
  const promises = entries.map(async ([userId, go, ds, sw]) => {
    await db.plugFc_Codes.create({ data: { userId, go, ds, switch: sw } });
  });

  await Promise.all(promises);
}

async function importRoles() {
  console.log('Importing roles');

  await db.plugRole_RoleConfig.deleteMany();

  const entries = await read('roles');
  const promises = entries.map(async ([roleId]) => {
    await db.plugRole_RoleConfig.create({ data: { roleId, requestable: true } });
  });

  await Promise.all(promises);
}

async function read(file) {
  const data = await readFile(`import/${file}.csv`, 'utf-8');
  const lines = data.split('\n');

  lines.shift(); // remove header
  return lines.map((l) => l.split(','));
}
