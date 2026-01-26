require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const {Collection, Events} = require('discord.js');
const {client } = require('./config/config');

const Database = require('better-sqlite3');

const db = new Database("./data.db");

db.pragma('journal_mode = WAL');

//initialize database if new instance
db.exec(`
  CREATE TABLE IF NOT EXISTS characters(
    char_id INTEGER PRIMARY KEY NOT NULL, 
    name TEXT NOT NULL COLLATE NOCASE UNIQUE, 
    level INTEGER NOT NULL, 
    race TEXT, 
    class TEXT,
    weight INTEGER, 
    height TEXT, 
    age INTEGER
  );
  CREATE TABLE IF NOT EXISTS weapons(
    weapon_id INTEGER PRIMARY KEY NOT NULL, 
    name TEXT NOT NULL COLLATE NOCASE UNIQUE, 
    rarity TEXT,
    description TEXT, 
    damage TEXT, 
    weight REAL
  );
  CREATE TABLE IF NOT EXISTS items(
    item_id INTEGER PRIMARY KEY NOT NULL, 
    name TEXT NOT NULL COLLATE NOCASE UNIQUE, 
    rarity TEXT,
    description TEXT, 
    weight REAL,
    cost TEXT
  );
  CREATE TABLE IF NOT EXISTS spells(
    spell_id INTEGER PRIMARY KEY NOT NULL, 
    name TEXT NOT NULL COLLATE NOCASE UNIQUE, 
    description TEXT, 
    damage TEXT, 
    type TEXT, 
    level INTEGER, 
    components TEXT
  );
  CREATE TABLE IF NOT EXISTS character_items(
    ci_id INTEGER PRIMARY KEY NOT NULL, 
    char_id INTEGER NOT NULL, 
    item_id INTEGER NOT NULL, 
    quantity INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS character_weapons(
    cw_id INTEGER PRIMARY KEY NOT NULL, 
    char_id INTEGER NOT NULL, 
    weapon_id INTEGER NOT NULL, 
    proficient BOOLEAN
  );
  CREATE TABLE IF NOT EXISTS character_spells(
    cs_id INTEGER PRIMARY KEY NOT NULL, 
    char_id INTEGER NOT NULL, 
    spell_id INTEGER NOT NULL, 
    ready INTEGER
  );
  CREATE TABLE IF NOT EXISTS stats(
    stats_id INTEGER PRIMARY KEY NOT NULL, 
    char_id INTEGER NOT NULL UNIQUE, 
    hp INTEGER,
    max_hp INTEGER, 
    str INTEGER, 
    dex INTEGER, 
    con INTEGER, 
    int INTEGER, 
    wis INTEGER, 
    cha INTEGER, 
    speed INTEGER
  );
`);

client.db = db;

client.commands = new Collection(); 

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Logged in as ${readyClient.user.tag}`);
});

client.login(process.env.TOKEN);

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return; 

  const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		}
	}
});
