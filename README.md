# DNDIgor
A Discord bot used to track character names, stats, items, spells, and more.

- [List of Commands](#commands)

For commands, square brackets '[]' represent a required input, whereas parentheses '()' represent optional input.


## Commands
- [Character Commands](#character-commands)
- [Group Commands](#group-commands)
- [Item Commands](#item-commands)
- [Weapon Commands](#weapon-commands)
- [Spell Commands](#spell-commands)
- [Miscellaneous Commands](#misc-commands)


### Character Commands
- /add-character [character] [level] (race|height|weight|age): Adds a new character to the party or changes the capitalization if name already exists.

- /character-bonuses [character]: Responds with a list of a character's stat bonuses.

- /character-info [character]: Responds with a description of a party member based on their characteristics.

- /character-items [character]: Responds with a list of all items in a character's inventory.

- /character-spells [character]: Responds with a list of all weapons in a character's inventory.

- /character-stats [character]: Responds with a description of a party member based on their base stats.

- /character-weapons [character]: Responds with a list of all weapons in a character's inventory.

- /delete-character [character]: Removes a character from the party, along with their items, weapons, spells, and stats.

- /list-characters: Responds with a list of all characters in the party.

- /set-bonuses [character] (str|dex|con|int|wis|cha): Sets a character's bonus stats;

- /set-character-info [character] (level|race|height|weight|age): Updates a party member's characteristics to new values.

- /set-character-stat [character] (str|dex|con|int|wis|cha|speed|hp|max_hp): Updates a character's base stats to new values.


### Group Commands
- /add-group [group]: Adds a new group to the group list.

- /delete-group [group]: Deletes a group.

- /group-members [group]: Lists all the members of a group.

- /join-group [character] [group]: Adds a character to a group.

- /leave-group [character] [group]: Removes a character from a group.

- /list-groups: Responds with a list of all groups.


### Item Commands
- /add-item [item]: Adds an item to the item pool.

- /delete-item [item]: Removes an item from the item pool and inventories.

- /give-item [character] [item] (quantity): Gives one or a specified number of an item to a character.

- /item-info [item]: Responds with a description of an item based on its characteristics.

- /list-items: Responds with a list of all items in the item pool.

- /set-item-info [item] (rarity|desc|cost|weight|bonuses): Updates an item's characteristics to new values. 

- /take-item [character] [item] (quantity): Takes one or a specified number of an item from a character. If quantity >= number of the item in inventory, erases it from inventory.


### Spell Commands
- /add-spell [spell]: Adds a spell to the spell pool.

- /delete-spell [spell]: Removes a spell from the spell pool.

- /give-spell [character] [spell]: Puts a spell in the spell pool into a character's known spells. 

- /list-spells: Responds with a list of all spells in the spell pool.

- /set-spell-info [spell] (desc|damage|duration|casting_time|range|type|level|components): Updates a spell's characteristics to new values. 

- /spell-info [spell]: Responds with a description of a spell based on its characteristics.

- /take-spell [character] [spell]: Removes a spell from a character's known spells.


### Weapon Commands
- /add-weapon [weapon]: Adds a weapon to the weapon pool.

- /delete-weapon [weapon]: Removes a weapon from the weapon pool.

- /give-weapon [character] [weapon]: Gives a weapon in the weapon pool to a character. 

- /list-weapons: Responds with a list of all weapons in the weapon pool.

- /set-weapon-info [weapon] (rarity|desc|damage|range|weight): Updates a weapon's characteristics to new values.

- /take-weapon [character] [weapon]: Removes a weapon from a character's inventory.

- /weapon-info [weapon]: Responds with a description of a weapon based on its characteristics.


### Misc Commands
- /damage [character] [amount]: Reduces a character's hp by a given amount. Responds if character is downed. 

- /heal [character] [amount]: Increases a character's hp by a given amount. Responds if character is at max hp.

- /help: Responds with a link to the Github, where a readme can be found.

- /toggle-mastery [character] [weapon]: Changes a character's mastery status of a weapon they own.

- /toggle-ready [character] [spell]: Changes a character's ready status of a spell they know.

- /total-weight [character]: Responds with a summation of all the weight carried by a character.

- /wassap [emphasis]: Responds with a greeting of variable emphasis.