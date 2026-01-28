const { SlashCommandBuilder } = require('discord.js');
const utils = require('../../utils.js');

module.exports = {
	data: new SlashCommandBuilder().setName('damage').setDescription("Deals damage to a character.")
  .addStringOption((option) => 
    option
      .setName("name")
      .setDescription("The character taking damage")
      .setRequired(true)
  )
  .addIntegerOption((option) => 
    option
      .setName("damage")
      .setDescription("The amount of damage to be dealt")
      .setRequired(true)
  )
  ,
	async execute(interaction) {
    let output = "";
    let tableName = "stats";
    let idType = "char_id";
    const db = interaction.client.db;

    let elemName = interaction.options.getString('name', true);
    let damage = interaction.options.getInteger('damage', true);

    if(damage > 1){
      let id = utils.getID(db, "characters", idType, elemName);
      if (id > 0){
        const data = db.prepare(`SELECT hp FROM ${tableName} WHERE ${idType} = ?`).get(id);
        if(data.hp != null && data.hp > 0){
          let total = data.hp;
          total -= damage;

          if(total <= 0){
            output = elemName + " only had " + data.hp + " hp left, and has been downed! ";
            total = 0;
          }

          output += utils.setStatInfo(db, tableName, idType, id, elemName, "hp", total, true) + ".";
          
        } else if (data.hp != null) {
          output = elemName + " was already downed, and gains another failed death saving throw!";
        } else {
          output = "Error: " + elemName + " hasn't set their hp yet.";
        }
      } else {
        output = `Error: No characters named ` + elemName + " were found.";
      }
    } else {
      output = "Error: damage must be a positive number.";
    }
		await interaction.reply(output);
	},
};