const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('heal').setDescription("Heals some of a character's hp.")
  .addStringOption((option) => 
    option
      .setName("name")
      .setDescription("The character being healed")
      .setRequired(true)
  )
  .addIntegerOption((option) => 
    option
      .setName("hp")
      .setDescription("The amount of hp to be healed")
      .setRequired(true)
  )
  ,
	async execute(interaction) {
    let output = "";
    let tableName = "stats";
    let idType = "char_id";
    const db = interaction.client.db;

    let elemName = interaction.options.getString('name', true);
    let hp = interaction.options.getInteger('hp', true);

    if(hp > 1){
      let id = utils.getID(db, "characters", idType, elemName);
      if (id > 0){
        const data = db.prepare(`SELECT * FROM ${tableName} WHERE ${idType} = ?`).get(id);
        if(data.hp != null && data.max_hp != null){
          let total = data.hp;
          total += hp;

          if(total > data.max_hp){
            output = elemName + " has been fully healed! ";
            total = data.max_hp;
          }

          output += utils.setStatInfo(db, tableName, idType, id, elemName, "hp", total, true) + ".";
          
        } else if (data.hp != null) {
          let total = data.hp;
          total += hp;
          output += utils.setStatInfo(db, tableName, idType, id, elemName, "hp", total, true) + ".";
        } else {
          output = "Error: " + elemName + " hasn't set their hp yet.";
        }
      } else {
        output = `Error: No characters named ` + elemName + " were found.";
      }
    } else {
      output = "Error: healing amount must be a positive number.";
    }
		await interaction.reply(output);
	},
};