# DNDIgor
A Discord bot used to track character names, stats, items, spells, and more.

- [List of Commands](#commands)


## Commands
- [Character Commands](#character-commands)
- [Item Commands](#item-commands)
- [Weapon Commands](#weapon-commands)
- [Spell Commands](#spell-commands)
- [Miscellaneous Commands](#misc-commands)


### Character Commands
- ~list-characters: Responds with a list of all characters in the party.

- ~add-character '[character name]': Adds a new character to the party or changes the capitalization if name already exists.

- ~delete-character '[character name]': Removes a character from the party, along with their items, weapons, spells, and stats.

- ~character-info '[character name]': Responds with a description of a party member based on their characteristics.

- ~set-character-info '[character name]' [level|race|height|weight|age] [value]: Updates one of a party member's characteristics to a new value.

- ~character-stats '[character name]': Responds with a description of a party member based on their stats.

- ~set-character-stat '[character name]' [str|dex|con|int|wis|cha|speed|max_hp] [value]: Updates one of a character's stats to a new value.

- ~character-items '[character name]': Responds with a list of all items in a character's inventory.

- ~character-weapons '[character name]': Responds with a list of all weapons in a character's inventory.

- ~character-spells '[character name]': Responds with a list of all weapons in a character's inventory.

### Item Commands
- ~list-items: Responds with a list of all items in the item pool.

- ~add-item '[item name]': Adds an item to the item pool.

- ~delete-item '[item name]': Removes an item from the item pool.

- ~give-item '[character name]' '[item name]' (quantity): Gives a specified number of an item to a character. Quantity is optional and will be converted to positive if not already. Quantity equals 1 if not input.

- ~take-item '[character name]' '[item name]' (quantity): Takes a specified number of an item from a character. Quantity is optional, and equals 1 if not input. If quantity >= number of the item in inventory, removes it from character_items completely.

- ~item-info '[item name]': Responds with a description of an item based on its characteristics.

- ~set-item-info '[item name]' [desc|cost|weight] [value]: Updates one of an item's characteristics to a new value. 

### Weapon Commands
- ~list-weapons: Responds with a list of all weapons in the weapon pool.

- ~add-weapon '[weapon name]': Adds a weapon to the weapon pool.

- ~delete-weapon '[weapon name]': Removes a weapon from the weapon pool.

- ~give-weapon '[character name]' '[weapon name]': Gives a weapon in the weapon pool to a character. 

- ~take-weapon '[character name]' '[weapon name]': Removes a weapon from a character's inventory.

- ~weapon-info '[weapon name]': Responds with a description of a weapon based on its characteristics.

- ~set-weapon-info '[weapon name]' [desc|damage|weight] [value]: Updates one of a weapon's characteristics to a new value. 

### Spell Commands
- ~list-spells: Responds with a list of all spells in the spell pool.

- ~add-spell '[spell name]': Adds a spell to the spell pool.

- ~delete-spell '[spell name]': Removes a spell from the spell pool.

- ~give-spell '[character name]' '[spell name]': Puts a spell in the spell pool into a character's known spells. 

- ~take-spell '[character name]' '[spell name]': Removes a spell from a character's known spells.

- ~spell-info '[spell name]': Responds with a description of a spell based on its characteristics.

- ~set-spell-info '[spell name]' [desc|damage|type|level|components] [value]: Updates one of a spell's characteristics to a new value. 


### Misc Commands
- ~help: Responds with a list of all valid commands.

- ~wassap [integer]: Responds with a greeting of variable emphasis.