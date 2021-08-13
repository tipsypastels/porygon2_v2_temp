import { config } from 'porygon/config';
import { PackageGuild } from 'porygon/package/kind';

export default PackageGuild.init(config('guilds.duck').value);
