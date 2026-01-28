const utils = require('../../utils.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('add-spell').setDescription('Adds a spell to the spell list.')
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
      .setName("duration")
      .setDescription("How long the spell lasts")
  )
  .addStringOption((option) => 
    option
      .setName("casting-time")
      .setDescription("When the spell can be cast (eg. action, bonus action, response, etc)")
  )
  .addStringOption((option) => 
    option
      .setName("range")
      .setDescription("The range of the spell")
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
    let range = interaction.options.getString('range');
    let casting_time = interaction.options.getString('casting-time');
    let duration = interaction.options.getString('duration');
    let desc = interaction.options.getString('description');

    const stmt = db.prepare(`INSERT INTO ${tableName} (name) VALUES (?)
    ON CONFLICT(name)
    DO NOTHING;`); 
    const info = stmt.run(elemName);
    
    if(info.changes > 0) {
      output = elemName + " has been added to the spell list! ";

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
      if(range){
        output += utils.setInfo(db, tableName, idType, elemName, "range", range, isFirst);
        isFirst = false;
      }
      if(duration){
        output += utils.setInfo(db, tableName, idType, elemName, "duration", duration, isFirst);
        isFirst = false;
      }
      if(casting_time){
        output += utils.setInfo(db, tableName, idType, elemName, "casting_time", casting_time, isFirst);
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

      if(level||desc||type||damage||components||duration||casting_time||range) output += "."; 
    } else {
      output = utils.setInfo(db, "spells", "spell_id", elemName, "name", elemName, true) + ".";
    }

		await interaction.reply(output);
	},
};