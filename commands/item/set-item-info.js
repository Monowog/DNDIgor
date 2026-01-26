const utils = require('../../utils.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('set-item-info').setDescription('Changes the characteristics of an item.')
  .addStringOption((option) => 
    option
      .setName("name")
      .setDescription("The item's name")
      .setRequired(true)
  )
  .addStringOption((option) => 
    option
      .setName("rarity")
      .setDescription("The item's rarity (common - legendary)")
  )
  .addStringOption((option) => 
    option
      .setName("description")
      .setDescription("A description of the item")
  )
  .addNumberOption((option) => 
    option
      .setName("weight")
      .setDescription("The item's weight in pounds")
  )
  .addStringOption((option) => 
    option
      .setName("cost")
      .setDescription("The cost of one item (ex. 3sp, 5cp)")
  )
  ,
	async execute(interaction) {
    let output = "";
    let tableName = "items";
    let idType = "item_id";
    const db = interaction.client.db;

    let elemName = interaction.options.getString('name', true);
    let rarity = interaction.options.getString('rarity');
    let desc = interaction.options.getString('description');
    let weight = interaction.options.getNumber('weight');
    let cost = interaction.options.getString('cost');

    const id = utils.getID(db, tableName, idType, elemName);
    
    if(id > 0) {

      let isFirst = true;
      if(rarity){
        output += utils.setInfo(db, tableName, idType, elemName, "rarity", rarity, isFirst);
        isFirst = false;
      }
      if(desc){
        output += utils.setInfo(db, tableName, idType, elemName, "description", desc, isFirst);
        isFirst = false;
      }
      if(weight){
        output += utils.setInfo(db, tableName, idType, elemName, "weight", weight, isFirst);
        isFirst = false;
      }
      if(cost){
        output += utils.setInfo(db, tableName, idType, elemName, "cost", cost, isFirst);
        isFirst = false;
      }

      if(output === "") output += "Error: no information input";
      output += "."; 
    } else {
      output = "Error: no items named " + elemName + " found.";
    }

		await interaction.reply(output);
	},
};