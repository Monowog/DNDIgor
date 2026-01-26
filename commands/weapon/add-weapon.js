const utils = require('../../utils.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('add-weapon').setDescription('Adds a weapon to the weapon pool.')
  .addStringOption((option) => 
    option
      .setName("name")
      .setDescription("The weapon's name")
      .setRequired(true)
  )
  .addNumberOption((option) => 
    option
      .setName("weight")
      .setDescription("The weapon's weight")
  )
  .addStringOption((option) => 
    option
      .setName("damage")
      .setDescription("The amount of damage the weapon does on hit")
  )
  .addStringOption((option) => 
    option
      .setName("rarity")
      .setDescription("The weapon's rarity (common-legendary)")
  )
  .addStringOption((option) => 
    option
      .setName("description")
      .setDescription("A description of the weapon")
  )
  ,
	async execute(interaction) {
    let output = "";
    let tableName = "weapons";
    let idType = "weapon_id";
    const db = interaction.client.db;

    let elemName = interaction.options.getString('name', true);
    let weight = interaction.options.getNumber('weight');
    let rarity = interaction.options.getString('rarity');
    let damage = interaction.options.getString('damage');
    let desc = interaction.options.getString('description');

    const stmt = db.prepare(`INSERT INTO ${tableName} (name) VALUES (?)
    ON CONFLICT(name)
    DO NOTHING;`); 
    const info = stmt.run(elemName);
    
    if(info.changes > 0) {
      output = elemName + " has been added to the weapon pool! ";

      let isFirst = true;
      if(rarity){
        output += utils.setInfo(db, tableName, idType, elemName, "rarity", rarity, isFirst);
        isFirst = false;
      }
      if(weight){
        output += utils.setInfo(db, tableName, idType, elemName, "weight", weight, isFirst);
        isFirst = false;
      }
      if(damage){
        output += utils.setInfo(db, tableName, idType, elemName, "damage", damage, isFirst);
        isFirst = false;
      }
      if(desc){
        output += utils.setInfo(db, tableName, idType, elemName, "description", desc, isFirst);
        isFirst = false;
      }

      if(rarity||desc||weight||damage) output += "."; 
    } else {
      output = utils.setInfo(db, "weapons", "weapon_id", elemName, "name", elemName, true);
    }

		await interaction.reply(output);
	},
};