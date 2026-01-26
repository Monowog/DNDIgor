const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Required for the bot to function in servers
    GatewayIntentBits.GuildMessages, // Required to receive messages in channels
    GatewayIntentBits.MessageContent // Required to read the content of messages 
  ]
});

const prefix = "~";

const commands = {
    help: "help", // ~help
    wassap: "wassap", // ~wassap [integer]
    
    listCharacters: "list-characters", // ~list-characters
    addCharacter: "add-character", // ~add-character '[character name]' 
    deleteCharacter: "delete-character", // ~delete-character '[character name]'
    characterInfo: "character-info", // ~character-info '[character name]'
    setCharacterInfo: "set-character-info", // ~set-character-info '[character name]' [level|race|height|weight|age] [value]
    characterStats: "character-stats", // ~character-stats '[character name]'
    setCharacterStat: "set-character-stat", // ~set-character-stat '[character name]' [str|dex|con|int|wis|cha|speed|max_hp] [value]
    characterItems: "character-items", // ~character-items '[character name]'
    characterWeapons: "character-weapons", // ~character-weapons '[character name]'
    characterSpells: "character-spells", // ~character-spells '[character name]'

    listItems: "list-items", // ~list-items
    addItem: "add-item", // ~add-item '[item name]'
    deleteItem: "delete-item", // ~delete-item '[item name]'
    giveItem: "give-item", // ~give-item '[character name]' '[item name]' (quantity)
    takeItem: "take-item", // ~take-item '[character name]' '[item name]' (quantity)
    itemInfo: "item-info", // ~item-info '[item name]'
    setItemInfo: "set-item-info", // ~set-item-info '[item name]' [desc|cost|weight] [value]

    listWeapons: "list-weapons", // ~list-weapons
    addWeapon: "add-weapon", // ~add-weapon '[weapon name]'
    deleteWeapon: "delete-weapon", // ~delete-weapon '[weapon name]'
    giveWeapon: "give-weapon", // ~give-weapon '[character name]' '[weapon name]' 
    takeWeapon: "take-weapon", // ~take-weapon '[character name]' '[weapon name]' 
    weaponInfo: "weapon-info", // ~weapon-info '[weapon name]'
    setWeaponInfo: "set-weapon-info", // ~set-weapon-info '[weapon name]' [desc|damage|weight] [value]

    listSpells: "list-spells", // ~list-spells
    addSpell: "add-spell", // ~add-spell '[spell name]'
    deleteSpell: "delete-spell", // ~delete-spell '[spell name]'
    giveSpell: "give-spell", // ~give-spell '[character name]' '[spell name]'
    takeSpell: "take-spell", // ~take-spell '[character name]' '[spell name]'
    spellInfo: "spell-info", // ~spell-info '[spell name]'
    setSpellInfo: "set-spell-info", // ~set-spell-info '[spell name]' [desc|damage|type|level|components] [value]
};

module.exports = { client, prefix, commands };