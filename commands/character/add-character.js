const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('add-character').setDescription('Adds a character to the party.')
  .addStringOption((option) => 
    option
      .setName("name")
      .setDescription("Your character's name")
      .setRequired(true)
  )
  .addIntegerOption((option) => 
    option
      .setName("level")
      .setDescription("Your character's level")
      .setRequired(true)
  )
  .addStringOption((option) => 
    option
      .setName("race")
      .setDescription("Your character's race")
  )
  .addStringOption((option) => 
    option
      .setName("class")
      .setDescription("Your character's class")
  )
  .addNumberOption((option) => 
    option
      .setName("weight")
      .setDescription("Your character's weight in pounds")
  )
  .addStringOption((option) => 
    option
      .setName("height")
      .setDescription("Your character's height (ex. 5'6\")")
  )
  .addIntegerOption((option) => 
    option
      .setName("age")
      .setDescription("Your character's age")
  ),
	async execute(interaction) {
    let output = "";
    let charName = interaction.options.getString('name', true);
    let level = interaction.options.getInteger('level', true);

    const charStmt = interaction.client.db.prepare(`INSERT INTO characters (name, level) VALUES (?,?)
    ON CONFLICT(name)
    DO NOTHING;`); 
    const info = charStmt.run(charName,level);
    
    if(info.changes > 0) {
      output = "Welcome to the party, " + charName + "!";

      //let char_id = getCharID(charName);

      //const statStmt = db.prepare('INSERT INTO stats (char_id) VALUES (?);');
      //statStmt.run(char_id);
    } else {
      output = "You Goofed Up!";
      //setCharacterInfo("name", charName, charName);
    }

		await interaction.reply(output);
	},
};