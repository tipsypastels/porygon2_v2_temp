# Porygon2 - Changelog

Porygon has been written to use Discord Slash Commands, which allow commands to be shown in the user interface and autocompleted.

## General changes

- The command prefix has been changed to `/`.
- Many commands are now *ephemeral*. This means that Porygon's response to the command is only shown to the user using it. As a result, there's much less of a need to restrict commands to #random, as ephemeral commands can't flood the chat for anyone but the person using them.
- Porygon's system for locking commands to specific channels has been removed as a result of this. The only exception is `/pet add`, which is a special case. It may be possible to add more restrictions, but given that most commands are ephemeral I don't think it will be needed.

## Changes to existing commands

This list does not include commands whose only change was to have their prefix go from `!` to `/`. So just to reiterate that - *all* commands use `/` now, even those not on this list.

Some commands may also have changed their semantics, see the next section.

| Command              | Change                    |
|----------------------|---------------------------|
| `!fc`                | Renamed to `/fc get`     |
| `!setfc`             | Renamed to `/fc set`      |
| `!delfc`             | Renamed to `/fc clear`    |
| `!addpet`            | Renamed to `/pet add`     |
| `!delpet`            | Renamed to `/pet remove`  |
| `!pet`               | Renamed to `/pet random`  |
| `!addrole`           | Renamed to `/role add`    |
| `!removerole`        | Renamed to `/role remove` |
| `!dice`              | Renamed to `/roll`        |
| `!poll`              | Removed                   |
| `!changelog`         | Removed                   |
| `!commands`          | Removed                   |
| `!tiers`             | Renamed to `/cooltrainer` |
| `!createrole`        | Removed (use `/rolemod`)  |
| `!deleterole`        | Removed (use `/rolemod`)  |
| `!makerequestable`   | Removed (use `/rolemod`)  |
| `!makeunrequestable` | Removed (use `/rolemod`)  |
| `!botignore`         | Removed                   |
| `!botunignore`       | Removed                   |
| `!mute`              | Removed                   |
| `!unmute`            | Removed                   |

## List of commands

| Command | Public | Ephemeral | Description |
|---------|--------|-----------|-------------|
| `/calc` | Yes | Yes | Does math problems. |
| `/flip` | Yes | No* | Flips a coin. |
| `/help` | Yes | Yes | Shows help information. |
| `/ping` | Yes | Yes | Shows status information. |
| `/roll` | Yes | No* | Rolls the dice.|
| `/cooltrainer scoreboard` | No | No | Shows the top cooltrainers. |
| `/cooltrainer show <member>` | No | No | Shows a member's score. |
| `/cooltrainer tick` | No | Yes | Recalculates everyone's cooltrainer score. Unsafe! |
| `/cooltrainer cycle` | No | Yes | Adjusts scores as if a week had passed. Unsafe! |
| `/fc get` | Yes | No | Shows friend codes for a user. |
| `/fc set [switch] [3ds] [go]` | Yes | Yes | Sets your friend code or codes.
| `/fc clear <switch, 3ds, go, all>` | Yes | Yes | Clears one or more of your friend codes.
| `/pet add` | Yes** | No | Adds a pet.*** |
| `/pet remove <id>` | Yes | Yes | Removes the pet with the specified ID.
| `/pet random` | Yes | No | Shows a random pet from a random member.
| `/pet random <member>` | Yes | No | Shows a random pet from the specified member.
| `/role add <role>` | Yes | Yes | Gives you the role, if it is requestable.
| `/role remove <role>` | Yes | Yes | Takes away the role, if it is requestable.
| `/rolemod get <role>` | No | Yes | Shows properties of a role.
| `/rolemod set <role> [name] [hoist] [mentionable] [requestable]` | No | Yes | Updates the role with the listed properties.
| `/rolemod create <name> [hoist] [mentionable] [requestable]` | No | Yes | Creates a role with the listed properties.
| `/rolelist` | Yes | Yes | Links to the role list page.
| `/perm get <command> [verbose]` | No | Yes | Shows who has permission to use the command.
| `/perm set <command> <role, member> <allow>` | No | Yes | Updates whether the role/member can use the specified command.
| `/perm canuse <command> <member>` | No | Yes | Shows whether the member can use the specified command.

`*` - Not ephemeral currently, but may change if overused.

`**` - Public on the command list, but errors if used outside of `#pets`.

`***` - Works differently from !addpet. Image must be posted in advance instead of attatched to the command.