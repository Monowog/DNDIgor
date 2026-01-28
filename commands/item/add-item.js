const utils = require('../../utils.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('add-item').setDescription('Adds an item to the item pool.')
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
  .addStringOption((option) => 
    option
      .setName("bonuses")
      .setDescription("The stat/effect bonuses an item provides (e.g. +2 dex and advantage against cold attacks")
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
    let bonuses = interaction.options.getString('options');

    const stmt = db.prepare(`INSERT INTO ${tableName} (name) VALUES (?)
    ON CONFLICT(name)
    DO NOTHING;`); 
    const info = stmt.run(elemName);
    
    if(info.changes > 0) {
      output = elemName + " has been added to the item pool! ";

      let isFirst = true;
      if(rarity){
        output += utils.setInfo(db, tableName, idType, elemName, "rarity", rarity, isFirst);
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
      if(bonuses){
        output += utils.setInfo(db, tableName, idType, elemName, "bonuses", bonuses, isFirst);
        isFirst = false;
      }
      if(desc){
        output += utils.setInfo(db, tableName, idType, elemName, "description", desc, isFirst);
        isFirst = false;
      }

      if(rarity||desc||weight||cost||bonuses) output += "."; 
    } else {
      output = utils.setInfo(interaction.client.db, "items", "item_id", elemName, "name", elemName, true);
    }

		await interaction.reply(output);
	},
};