const utils = require('../../utils.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('set-character-stats').setDescription('Changes the stat-bonuses of a character.')
  .addStringOption((option) => 
    option
      .setName("name")
      .setDescription("The changing character's name")
      .setRequired(true)
  )
  .addIntegerOption((option) => 
    option
      .setName("str_bonus")
      .setDescription("The character's strength bonus")
  )
  .addIntegerOption((option) => 
    option
      .setName("dex_bonus")
      .setDescription("The character's dexterity bonus")
  )
  .addIntegerOption((option) => 
    option
      .setName("con_bonus")
      .setDescription("The character's constitution bonus")
  )
  .addIntegerOption((option) => 
    option
      .setName("int_bonus")
      .setDescription("The character's intelligence bonus")
  )
  .addIntegerOption((option) => 
    option
      .setName("wis_bonus")
      .setDescription("The character's wisdom bonus")
  )
  .addIntegerOption((option) => 
    option
      .setName("cha_bonus")
      .setDescription("The character's charisma bonus")
  )
  ,
  async execute(interaction) {
    let output = "";
    let tableName = "stats";
    let idType = "char_id";
    const db = interaction.client.db;

    let charName = interaction.options.getString('name', true);
    let str = interaction.options.getInteger('str_bonus');
    let dex = interaction.options.getInteger('dex_bonus');
    let con = interaction.options.getInteger('con_bonus');
    let int = interaction.options.getInteger('int_bonus');
    let wis = interaction.options.getInteger('wis_bonus');
    let cha = interaction.options.getInteger('cha_bonus');

    const id = utils.getID(db, "characters", idType, charName);
    
    if(id > 0) {

      let isFirst = true;
      if(str){
        output += utils.setStatInfo(db, tableName, idType, id, charName, "str_bonus", str, isFirst);
        isFirst = false;
      }
      if(dex){
        output += utils.setStatInfo(db, tableName, idType, id, charName, "dex_bonus", dex, isFirst);
        isFirst = false;
      }
      if(con){
        output += utils.setStatInfo(db, tableName, idType, id, charName, "con_bonus", con, isFirst);
        isFirst = false;
      }
      if(int){
        output += utils.setStatInfo(db, tableName, idType, id, charName, "int_bonus", int, isFirst);
        isFirst = false;
      }
      if(wis){
        output += utils.setStatInfo(db, tableName, idType, id, charName, "wis_bonus", wis, isFirst);
        isFirst = false;
      }
      if(cha){
        output += utils.setStatInfo(db, tableName, idType, id, charName, "cha_bonus", cha, isFirst);
        isFirst = false;
      }

      if(output === "") output += "Error: no information input"
      output += "."
    } else {
      output = "Error: no characters named " + charName + " found.";
    }

    await interaction.reply(output);
  },
};