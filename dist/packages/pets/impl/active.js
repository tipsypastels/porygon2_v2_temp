"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivatePetsBy = exports.activatePetsBy = void 0;
const core_1 = require("porygon/core");
async function activatePetsBy({ id }) {
    await core_1.db.$executeRaw `
    UPDATE 
      "public"."PkgPets_Pet"
    SET
      "active" = TRUE
    WHERE
      "userId" = ${id}
  `;
}
exports.activatePetsBy = activatePetsBy;
async function deactivatePetsBy({ id }) {
    await core_1.db.$executeRaw `
    UPDATE 
      "public"."PkgPets_Pet"
    SET
      "active" = FALSE
    WHERE
      "userId" = ${id}
  `;
}
exports.deactivatePetsBy = deactivatePetsBy;
