import { config } from 'porygon/config';
import { PackageGuild } from 'porygon/package';

export default PackageGuild.init(config('guilds.pokecom').value);
