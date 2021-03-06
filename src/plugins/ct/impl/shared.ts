import { Snowflake } from 'discord.js';
import { config } from 'porygon/config';

export const CtConfig = {
  // don't assign directly so we can retain
  // the ability of config to change at runtime
  get enabled() {
    return config('plug.ct.enabled').value;
  },

  get roleId() {
    return config('plug.ct.role').value;
  },

  get threshold() {
    return config('plug.ct.threshold').value;
  },

  get ppmExceptions(): Record<Snowflake, number> {
    return config('plug.ct.ppmExceptions').value;
  },
};
