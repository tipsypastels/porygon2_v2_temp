# Porygon2 - Changelog

Porygon has been written to use Discord Slash Commands, which allow commands to be shown in the user interface and autocompleted.

## General changes

- The command prefix has been changed to `/`.
- Many commands are now *ephemeral*. This means that Porygon's response to the command is only shown to the user using it. As a result, there's much less of a need to restrict commands to #random, as ephemeral commands can't flood the chat for anyone but the person using them.
- Porygon's system for locking commands to specific channels has been removed as a result of this. The only exception is `/pets add`, which is a special case. It may be possible to add more restrictions, but given that most commands are ephemeral I don't think it will be needed.

## Changed Commands

This list does not include commands whose only change was to have their prefix go from `!` to `/`. So just to reiterate that - *all* commands use `/` now, even those not on this list.

Some commands may also have changed their semantics, see the next section.

| Command       | Change                    |
|---------------|---------------------------|
| `!fc`         | Renamed to `/fc show`     |
| `!setfc`      | Renamed to `/fc set`      |
| `!delfc`      | Renamed to `/fc clear`    |
| `!addpet`     | Renamed to `/pet add`     |
| `!delpet`     | Renamed to `/pet remove`  |
| `!pet`        | Renamed to `/pet random`  |
| `!addrole`    | Renamed to `/role add`    |
| `!removerole` | Renamed to `/role remove` |
| `!dice`       | Renamed to `/roll`        |
| `!poll`       | Removed                   |
| `!changelog`  | Removed                   |
| `!commands`   | Removed                   |

## List of commands

### Core Utilities

**/calc**
Does math problems.
Ephemeral: no (may change if overused)
Public: yes

**/flip**
Flips a coin.
Ephemeral: no (may change if overused)
Public: yes

**/help**
Shows help information.
Ephemeral: yes
Public: yes

**/ping**
Shows status information.
Ephemeral: yes
Public: yes

**/roll**
Rolls the dice.
Ephemeral: no (may change if overused)
Public: yes

### Cooltrainer

**/cooltrainer scoreboard**
Shows the top coltrainer users.
Ephemeral: no
Public: no

**/cooltrainer show <member>**
Shows a user's cooltrainer status.
Ephemeral: no
Public: no

**/cooltrainer tick**
Recalculates everyone's cooltrainer score, causing people above or below 600 points to gain or lose the role.
Ephemeral: yes
Public: no

**/cooltrainer cycle**
Tricks cooltrainer into thinking a week passed, and adjusts everyone's score accordingly.
Ephemeral: yes
Public: no

### Friend Codes

**/fc get <member>**
Shows friend codes for a member.
Ephemeral: no
Public: yes

**/fc set [switch] [3ds] [go]**
Sets your friend code for one or more platforms.
Ephemeral: yes
Public: yes

**/fc clear <switch | 3ds | go | all>**
Clears your friend code for one or all platforms.
Ephemeral: yes
Public: yes

### Pets

**/pets add**
Finds the last image you posted in a channel and uploads it as a pet.
**NOTE:** This is different from how old Pory's pets work and we will need to explain that to people.
Ephemeral: no
Public: yes (errors ephemerally if used outside of #pets)

**/pets remove <id>**
Removes the pet with a given ID.
Ephemeral: yes
Public: yes

**/pets random**
Shows a random pet.
Ephemeral: no
Public: yes

**/pets random <member>**
Shows a random pet by the chosen member.
Ephemeral: no
Public: no

### Role Management

**/role add <role>**
Gives you the role, if it is requestable.
Ephemeral: yes
Public: yes

**/role remove <role>**
Removes the role, if it is requestable.
Ephemeral: yes
Public: yes

**/rolemod get <role>**
Shows the name, hoistedness, mentionability, and requestability of a role.
Ephemeral: yes
Public: no

**/rolemod set <role> [name] [hoist] [mentionable] [requestable]**
Updates one or more of the listed properties.
Ephemeral: yes
Public: no

**/rolemod create <name> [hoist] [mentionable] [requestable]**
Creates a new role with the listed properties.
Ephemeral: yes
Public: no

**/rolelist**
Links to the role list page.