const utils = require('../../utils.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('set-character-stats').setDescription('Changes the statistics of a party member.')
  .addStringOption((option) => 
    option
      .setName("name")
      .setDescription("The changing character's name")
      .setRequired(true)
  )
  .addIntegerOption((option) => 
    option
      .setName("hp")
      .setDescription("The character's hit points")
  )
  .addIntegerOption((option) => 
    option
      .setName("max_hp")
      .setDescription("The character's maximum hit points")
  )
  .addIntegerOption((option) => 
    option
      .setName("str")
      .setDescription("The character's strength")
  )
  .addIntegerOption((option) => 
    option
      .setName("dex")
      .setDescription("The character's dexterity")
  )
  .addIntegerOption((option) => 
    option
      .setName("con")
      .setDescription("The character's constitution")
  )
  .addIntegerOption((option) => 
    option
      .setName("int")
      .setDescription("The character's intelligence")
  )
  .addIntegerOption((option) => 
    option
      .setName("wis")
      .setDescription("The character's wisdom")
  )
  .addIntegerOption((option) => 
    option
      .setName("cha")
      .setDescription("The character's charisma")
  )
  .addIntegerOption((option) => 
    option
      .setName("speed")
      .setDescription("The character's movement speed (in feet)")
  ),
  async execute(interaction) {
    let output = "";
    let tableName = "stats";
    let idType = "char_id";
    const db = interaction.client.db;

    let charName = interaction.options.getString('name', true);
    let hp = interaction.options.getInteger('hp');
    let maxHP = interaction.options.getInteger('max_hp');
    let str = interaction.options.getInteger('str');
    let dex = interaction.options.getInteger('dex');
    let con = interaction.options.getInteger('con');
    let int = interaction.options.getInteger('int');
    let wis = interaction.options.getInteger('wis');
    let cha = interaction.options.getInteger('cha');
    let speed = interaction.options.getInteger('speed');

    const id = utils.getID(db, "characters", idType, charName);
    
    if(id > 0) {

      let isFirst = true;
      if(hp){
        output += utils.setStatInfo(db, tableName, idType, id, charName, "hp", hp, isFirst);
        isFirst = false;
      }
      if(maxHP){
        output += utils.setStatInfo(db, tableName, idType, id, charName, "max_hp", maxHP, isFirst);
        isFirst = false;
      }
      if(str){
        output += utils.setStatInfo(db, tableName, idType, id, charName, "str", str, isFirst);
        isFirst = false;
      }
      if(dex){
        output += utils.setStatInfo(db, tableName, idType, id, charName, "dex", dex, isFirst);
        isFirst = false;
      }
      if(con){
        output += utils.setStatInfo(db, tableName, idType, id, charName, "con", con, isFirst);
        isFirst = false;
      }
      if(int){
        output += utils.setStatInfo(db, tableName, idType, id, charName, "int", int, isFirst);
        isFirst = false;
      }
      if(wis){
        output += utils.setStatInfo(db, tableName, idType, id, charName, "wis", wis, isFirst);
        isFirst = false;
      }
      if(cha){
        output += utils.setStatInfo(db, tableName, idType, id, charName, "cha", cha, isFirst);
        isFirst = false;
      }
      if(speed){
        output += utils.setStatInfo(db, tableName, idType, id, charName, "speed", speed, isFirst);
        isFirst = false;
      }

      if(output === "") output += "Error: no information input"
      output += "."
    } else {
      output = "Error: no character named " + charName + " found.";
    }

    await interaction.reply(output);
  },
};