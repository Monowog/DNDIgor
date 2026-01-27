const utils = require('../../utils.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('set-spell-info').setDescription("Changes a spell's characteristics.")
  .addStringOption((option) => 
    option
      .setName("name")
      .setDescription("The spell's name")
      .setRequired(true)
  )
  .addIntegerOption((option) => 
    option
      .setName("level")
      .setDescription("The item's level (0-9)")
  )
  .addStringOption((option) => 
    option
      .setName("type")
      .setDescription("The school of magic associated with the spell")
  )
  .addStringOption((option) => 
    option
      .setName("damage")
      .setDescription("The amount of damage the spell does")
  )
  .addStringOption((option) => 
    option
      .setName("components")
      .setDescription("The costs of casting the spell")
  )
  .addStringOption((option) => 
    option
      .setName("description")
      .setDescription("A description of the spell")
  )
  ,
  async execute(interaction) {
    let output = "";
    let tableName = "spells";
    let idType = "spell_id";
    const db = interaction.client.db;

    let elemName = interaction.options.getString('name', true);
    let level = interaction.options.getInteger('level');
    let type = interaction.options.getString('type');
    let damage = interaction.options.getString('damage');
    let components = interaction.options.getString('components');
    let desc = interaction.options.getString('description');

    const id = utils.getID(db, tableName, idType, elemName);
    
    if(id > 0) {
      let isFirst = true;
      if(level){
        output += utils.setInfo(db, tableName, idType, elemName, "level", level, isFirst);
        isFirst = false;
      }
      if(type){
        output += utils.setInfo(db, tableName, idType, elemName, "type", type, isFirst);
        isFirst = false;
      }
      if(damage){
        output += utils.setInfo(db, tableName, idType, elemName, "damage", damage, isFirst);
        isFirst = false;
      }
      if(components){
        output += utils.setInfo(db, tableName, idType, elemName, "components", components, isFirst);
        isFirst = false;
      }
      if(desc){
        output += utils.setInfo(db, tableName, idType, elemName, "description", desc, isFirst);
        isFirst = false;
      }

      if(output === "") output += "Error: no information input";
      output += ".";
    } else {
      output = "Error: no " + tableName + " named " + elemName + " were found.";
    }

    await interaction.reply(output);
  },
};