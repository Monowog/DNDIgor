const utils = require('../../utils.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('add-group').setDescription('Adds a group to the list of groups.')
  .addStringOption((option) => 
    option
      .setName("name")
      .setDescription("The group's title")
      .setRequired(true)
  )
  ,
	async execute(interaction) {
    let output = "";
    let tableName = "groups";
    let idType = "group_id";
    const db = interaction.client.db;

    let elemName = interaction.options.getString('name', true);

    const stmt = db.prepare(`INSERT INTO ${tableName} (name) VALUES (?)
    ON CONFLICT(name)
    DO NOTHING;`); 
    const info = stmt.run(elemName);
    
    if(info.changes > 0) {
      output = elemName + " has been added to the list of groups! ";
    } else {
      output = utils.setInfo(db, "groups", "group_id", elemName, "name", elemName, true);
    }

		await interaction.reply(output);
	},
};