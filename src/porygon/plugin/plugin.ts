import { Collection, Snowflake } from 'discord.js';
import { Porygon } from 'porygon/core';
import { Cell, BaseCommand } from 'porygon/interaction';
import { zip } from 'support/array';
import { PluginKind } from './kind';
import { PluginCommandUploader } from './upload';

/**
 * A plugin is a unit of command and event grouping, and a manager for
 * the setup process of both. Plugins are never initialized directly
 * (and are not even constructable), but are created by the `setupPlugins`
 * function.
 *
 * It should be noted, since the implications of this are subtle,
 * that a plugin does *NOT* correspond one-to-one to one subdirectory
 * in the `plugins` directory. The reason for this is a conflict of
 * priorities: we want to group commands by topic (ai, role, op)
 * instead of only by their guild. However, we also want to batch
 * upload commands as much as possible, and successive batch
 * uploads to the same destination will overwrite each other.
 *
 * The solution is a de-duplication scheme called `PluginKind`s.
 * Each `PluginKind` represents an upload target, such as a guild,
 * or globally. Two plugin directories with the same `PluginKind`
 * actually share the exact same `Plugin` object. This allows us
 * to arbitrarily subdivide our plugin directories, but produce the
 * minimal set of destinations to upload commands to.
 *
 * This has some consequences. First of all, only one `Plugin` ever
 * exists in development mode, because all `PluginKind`s are replaced
 * with a development shim. Secondly, it's not possible via a
 * `Plugin` object to retrieve the name of the directory it was
 * defined in (for logging, etc) since it most likely originated
 * in *several* directories. If a unique ID for a plugin is needed,
 * `plugin.kind.tag` is available, though it's not a pretty one.
 *
 * @see PluginKind - Unique ID for each plugin.
 * @see PluginCommandUploader - Manages command uploads and caching.
 */
export class Plugin {
  static ALL = new Collection<PluginKind, Plugin>();
  static SAVED_COMMANDS = new Collection<Snowflake, Cell>();

  private unsavedCommands: BaseCommand[] = [];

  static uploadAllCommands() {
    return Promise.all(this.ALL.map((p) => p.uploadCommands()));
  }

  static init(kind: PluginKind, client: Porygon) {
    return this.ALL.get(kind) || new this(kind, client);
  }

  private constructor(private kind: PluginKind, readonly client: Porygon) {
    Plugin.ALL.set(kind, this);
  }

  addCommand(command: BaseCommand) {
    this.unsavedCommands.push(command);
  }

  private async uploadCommands() {
    const uploader = new PluginCommandUploader(this, this.kind, this.unsavedCommands);
    const apis = await uploader.upload();

    for (const [command, api] of zip(this.unsavedCommands, apis)) {
      const ref = new Cell(this, api, command);
      Plugin.SAVED_COMMANDS.set(ref.id, ref);
    }

    this.unsavedCommands = [];
  }
}
