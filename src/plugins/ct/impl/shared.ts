import { Snowflake } from 'discord.js';
import { config } from 'porygon/config';
import { createLogger } from 'porygon/logger';
import colors from 'colors';

export const CtConfig = {
  // don't assign directly so we can retain
  // the ability of config to change at runtime
  get roleId() {
    return config('pkg.ct.role').value;
  },

  get threshold() {
    return config('pkg.ct.threshold').value;
  },

  get ppmExceptions(): Record<Snowflake, number> {
    return config('pkg.ct.ppm_exceptions').value;
  },
};

export const ctLogger = createLogger('cooltrainer', colors.bgBlue);
