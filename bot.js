const { client } = require('./config/config');
const { prefix } = require("./config/config")
const { commands } = require("./config/config")
const config = require('./config/default');
const Database = require('better-sqlite3');

let params;
let output;

const db = new Database("./data.db");

db.pragma('journal_mode = WAL');

//initialize database if new instance
db.exec(`
  CREATE TABLE IF NOT EXISTS characters(
    char_id INTEGER PRIMARY KEY NOT NULL, 
    name TEXT NOT NULL COLLATE NOCASE UNIQUE, 
    level INTEGER NOT NULL, 
    race TEXT, 
    class TEXT,
    weight INTEGER, 
    height TEXT, 
    age INTEGER
  );
  CREATE TABLE IF NOT EXISTS weapons(
    weapon_id INTEGER PRIMARY KEY NOT NULL, 
    name TEXT NOT NULL COLLATE NOCASE UNIQUE, 
    desc TEXT, 
    damage TEXT, 
    weight REAL
  );
  CREATE TABLE IF NOT EXISTS items(
    item_id INTEGER PRIMARY KEY NOT NULL, 
    name TEXT NOT NULL COLLATE NOCASE UNIQUE, 
    desc TEXT, 
    weight REAL,
    cost TEXT
  );
  CREATE TABLE IF NOT EXISTS spells(
    spell_id INTEGER PRIMARY KEY NOT NULL, 
    name TEXT NOT NULL COLLATE NOCASE UNIQUE, 
    desc TEXT, 
    damage TEXT, 
    type TEXT, 
    level INTEGER, 
    components TEXT
  );
  CREATE TABLE IF NOT EXISTS character_items(
    ci_id INTEGER PRIMARY KEY NOT NULL, 
    char_id INTEGER NOT NULL, 
    item_id INTEGER NOT NULL, 
    quantity INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS character_weapons(
    cw_id INTEGER PRIMARY KEY NOT NULL, 
    char_id INTEGER NOT NULL, 
    weapon_id INTEGER NOT NULL, 
    proficient BOOLEAN
  );
  CREATE TABLE IF NOT EXISTS character_spells(
    cs_id INTEGER PRIMARY KEY NOT NULL, 
    char_id INTEGER NOT NULL, 
    spell_id INTEGER NOT NULL, 
    ready TEXT
  );
  CREATE TABLE IF NOT EXISTS stats(
    stats_id INTEGER PRIMARY KEY NOT NULL, 
    char_id INTEGER NOT NULL UNIQUE, 
    max_hp INTEGER, 
    str INTEGER, 
    dex INTEGER, 
    con INTEGER, 
    int INTEGER, 
    wis INTEGER, 
    cha INTEGER, 
    speed INTEGER
  );
`);

client.on('clientReady', () => {
  console.log('Logged in as ' + client.user.tag);
});

client.login(config.DISCORD_TOKEN);

client.on('messageCreate', (msg) => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(prefix)) return; // do nothing if not command

  const userCmd = msg.content.slice(prefix.length);
  const tokens = userCmd.split(" ");

  switch (tokens[0]) {
    case commands.help:
      let list = "";
      Object.keys(commands).forEach(key => {
          list += "(" + prefix + commands[key] + ") ";
      });
      msg.reply(list);
      break;

    case commands.wassap:
      if (tokens.length === 2){
        output = "WASS";
        let numA = parseInt(tokens[1]);
        if (Number.isNaN(numA)){
          msg.reply("Syntax Error: use ~" + commands.wassap + "  [int]");
        } else {
          if (numA > 1995) numA = 1995;

          for (let i = 0; i < numA; i++){
            output += "A";
          }
          output += "P";
          msg.reply(output);
        }
      } else {
        output = "Syntax Error: use ~" + commands.wassap + "  [int]";
        msg.reply(output);
      }
      break;

    case commands.addCharacter: 
      params = userCmd.split("'");
      if (params.length === 2 || params.length === 3){ 
        addCharacter(params[1]);
        msg.reply(output);
      } else {
        output = "Syntax Error: use ~" + commands.addCharacter + "  '[character name]'";
        msg.reply(output);
      }
      break;

    case commands.deleteCharacter:
      params = userCmd.split("'");
      if (params.length === 2 || params.length === 3){ 
        deleteCharacter(params[1]);
      } else {
        output = "Syntax Error: Use ~" + commands.deleteCharacter + "  '[character name]'";
      }
      msg.reply(output);
      break;
    
    case commands.listCharacters:
      output = "";
      listCharacters();

      if(output === "") output = "There are currently no characters in the party.";
      msg.reply(output);
      break;
    
    case commands.characterInfo:
      params = userCmd.split("'");
      if (params.length === 2 || params.length === 3){ 
        characterInfo(params[1]);
      } else {
        output = "Syntax Error: Use ~" + commands.characterInfo + "  '[character name]'";
      }
      msg.reply(output);
      break;

    case commands.setCharacterInfo:
      params = userCmd.split("'");
      if (params.length > 2){
        let index = 0;
        for(let i = 0; i < 2; i++) index = userCmd.indexOf("'", index+1);
        let ending = userCmd.slice(index);
        let column = ending.split(" ");
        if (column.length < 3){
          output = "Syntax Error: Use ~" + commands.setCharacterInfo + "  '[character name]'  [level|race|class|height|weight|age]  [value]";
          msg.reply(output);
          break;
        }

        if(column[1] === "char_id" || column[1] === "name"){
          output = "Nice try, bucko.";
          msg.reply(output);
          break;
        }

        let value = column[2];
        for(let i = 3; i < column.length; i++){
          value += " " + column[i];
        }

        setCharacterInfo(column[1], value, params[1]);
      } else {
        output = "Syntax Error: Use ~" + commands.setCharacterInfo + "  '[character name]'  [level|race|class|height|weight|age]  [value]";
      }

      msg.reply(output);
      break;
    
    case commands.characterStats:
      params = userCmd.split("'");
      if (params.length === 2 || params.length === 3){
        characterStats(params[1]);
      } else {
        output = "Syntax Error: Use ~" + commands.characterStats + "  '[character name]'";
      }
      msg.reply(output);
      break;

    case commands.setCharacterStat:
      params = userCmd.split("'");
      if (params.length > 2){
        let index = 0;
        for(let i = 0; i < 2; i++) index = userCmd.indexOf("'", index+1);
        let ending = userCmd.slice(index);
        let column = ending.split(" ");
        if (column.length != 3){
          output = "Syntax Error: Use ~" + commands.setCharacterStat + "  '[character name]'  [str|dex|con|int|wis|cha|speed|max_hp]  [value]";
          msg.reply(output);
          break;
        }

        setCharacterStat(column[1], column[2], params[1]);
      } else {
        output = "Syntax Error: Use ~" + commands.setCharacterStat + "  '[character name]'  [str|dex|con|int|wis|cha|speed|max_hp]  [value]";
      }
      msg.reply(output);
      break;

    case commands.characterItems:
      params = userCmd.split("'");
      if (params.length === 2 || params.length === 3){ 
        characterItems(params[1]);
      } else {
        output = "Syntax Error: Use ~" + commands.characterItems + "  '[character name]'";
      }
      msg.reply(output);
      break;

    case commands.listItems:
      output = "";
      listItems();

      if(output === "") output = "There are currently no items in the pool.";
      msg.reply(output);
      break;

    case commands.characterWeapons:
      params = userCmd.split("'");
      if (params.length === 2 || params.length === 3){ 
        characterWeapons(params[1]);
      } else {
        output = "Syntax Error: Use ~" + commands.characterWeapons + "  '[character name]'";
      }
      msg.reply(output);
      break;

    case commands.characterSpells:
      params = userCmd.split("'");
      if (params.length === 2 || params.length === 3){ 
        characterSpells(params[1]);
      } else {
        output = "Syntax Error: Use ~" + commands.characterSpells + "  '[character name]'";
      }
      msg.reply(output);
      break;

    case commands.listItems:
      output = "";
      listItems();

      if(output === "") output = "There are currently no items in the pool.";
      msg.reply(output);
      break;

    case commands.addItem:
      params = userCmd.split("'");
      if (params.length === 2 || params.length === 3){ 
        addItem(params[1]);
        msg.reply(output);
      } else {
        output = "Syntax Error: use ~" + commands.addItem + "  '[item name]'";
        msg.reply(output);
      }
      break;
    
    case commands.deleteItem:
      params = userCmd.split("'");
      if (params.length === 2 || params.length === 3){ 
        deleteItem(params[1]);
      } else {
        output = "Syntax Error: Use ~" + commands.deleteItem + "  '[item name]'";
      }
      msg.reply(output);
      break;

    case commands.giveItem:
      params = userCmd.split("'");
      if(params.length > 3 && params.length < 6){ 
        let quan = params[4].split(" "); //get quantity
        let quantity = 1;

        if(quan.length > 1){ //quantity was input
          quantity = parseInt(quan[1]);
          if(!quantity || quantity < 0){ //ensure valid quantity
            output = "Error: " + quan[1] + " is not a valid quantity";
            msg.reply(output);
            break;
          }
        }

        giveItem(params[1], params[3], quantity);
      } else {
        output = "Syntax Error: use ~" + commands.giveItem + "  '[character name]'  '[item name]'  (quantity)";
      }
      msg.reply(output);
      break;

    case commands.takeItem:
      params = userCmd.split("'");
      if(params.length > 3 && params.length < 6){ 
        let quan = params[4].split(" "); //get quantity
        let quantity = 1;

        if(quan.length > 1){ //quantity was input
          quantity = parseInt(quan[1]);
          if(!quantity || quantity < 0){ //ensure valid quantity
            output = "Error: " + quan[1] + " is not a valid quantity";
            msg.reply(output);
            break;
          }
        }

        takeItem(params[1], params[3], quantity);
      } else {
        output = "Syntax Error: use ~" + commands.takeItem + "  '[character name]'  '[item name]'  (quantity)";
      }
      msg.reply(output);
      break;

    case commands.itemInfo:
      params = userCmd.split("'");
      if (params.length === 2 || params.length === 3){ 
        itemInfo(params[1]);
      } else {
        output = "Syntax Error: Use ~" + commands.itemInfo + "  '[item name]'";
      }
      msg.reply(output);
      break;

    case commands.setItemInfo:
      params = userCmd.split("'");
      if (params.length > 2){
        let index = 0;
        for(let i = 0; i < 2; i++) index = userCmd.indexOf("'", index+1);
        let ending = userCmd.slice(index);
        let column = ending.split(" ");
        if (column.length < 3){
          output = "Syntax Error: Use ~" + commands.setItemInfo + "  '[item name]'  [desc|weight|cost]  [value]";
          msg.reply(output);
          break;
        }

        if(column[1] === "item_id" || column[1] === "name"){
          output = "Nice try, bucko.";
          msg.reply(output);
          break;
        }

        let value = column[2];
        for(let i = 3; i < column.length; i++){
          value += " " + column[i];
        }

        setItemInfo(column[1], value, params[1]);
      } else {
        output = "Syntax Error: Use ~" + commands.setItemInfo + "  '[item name]'  [desc|weight|cost]  [value]";
      }
      msg.reply(output);
      break;

    case commands.listWeapons:
      output = "";
      listWeapons();

      if(output === "") output = "There are currently no weapons in the pool.";
      msg.reply(output);
      break;  

    case commands.addWeapon:
      params = userCmd.split("'");
      if (params.length === 2 || params.length === 3){ 
        addWeapon(params[1]);
      } else {
        output = "Syntax Error: use ~" + commands.addWeapon + "  '[weapon name]'";
      }
      msg.reply(output);
      break;

    case commands.deleteWeapon:
      params = userCmd.split("'");
      if (params.length === 2 || params.length === 3){ 
        deleteWeapon(params[1]);
      } else {
        output = "Syntax Error: Use ~" + commands.deleteWeapon + "  '[weapon name]'";
      }
      msg.reply(output);
      break;

    case commands.giveWeapon:
      params = userCmd.split("'");

      if(params.length > 3 && params.length < 6) { 
        giveWeapon(params[1], params[3]);
      } else {
        output = "Syntax Error: use ~" + commands.giveWeapon + "  '[character name]'  '[weapon name]'";
      }
      msg.reply(output);
      break;

    case commands.takeWeapon:
      params = userCmd.split("'");
      if(params.length > 3 && params.length < 6){ 
        takeWeapon(params[1], params[3]);
      } else {
        output = "Syntax Error: use ~" + commands.takeWeapon + "  '[character name]'  '[weapon name]'";
      }
      msg.reply(output);
      break;
    
    case commands.weaponInfo:
      params = userCmd.split("'");
      if (params.length === 2 || params.length === 3){ 
        weaponInfo(params[1]);
      } else {
        output = "Syntax Error: Use ~" + commands.weaponInfo + "  '[weapon name]'";
      }
      msg.reply(output);
      break;

    case commands.setWeaponInfo:
      params = userCmd.split("'");
      if (params.length > 2){
        let index = 0;
        for(let i = 0; i < 2; i++) index = userCmd.indexOf("'", index+1);
        let ending = userCmd.slice(index);
        let column = ending.split(" ");
        if (column.length < 3){
          output = "Syntax Error: Use ~" + commands.setWeaponInfo + "  '[weapon name]'  [desc|damage|weight]  [value]";
          msg.reply(output);
          break;
        }

        if(column[1] === "weapon_id" || column[1] === "name"){
          output = "Nice try, bucko.";
          msg.reply(output);
          break;
        }

        let value = column[2];
        for(let i = 3; i < column.length; i++){
          value += " " + column[i];
        }

        setWeaponInfo(column[1], value, params[1]);
      } else {
        output = "Syntax Error: Use ~" + commands.setWeaponInfo + "  '[weapon name]'  [desc|damage|weight]  [value]";
      }
      msg.reply(output);
      break;

    case commands.listSpells:
      output = "";
      listSpells();

      if(output === "") output = "There are currently no spells on the spell list.";
      msg.reply(output);
      break;  

    case commands.addSpell:
      params = userCmd.split("'");
      if (params.length === 2 || params.length === 3){ 
        addSpell(params[1]);
      } else {
        output = "Syntax Error: use ~" + commands.addSpell + "  '[spell name]'";
      }
      msg.reply(output);
      break;

    case commands.deleteSpell:
      params = userCmd.split("'");
      if (params.length === 2 || params.length === 3){ 
        deleteSpell(params[1]);
      } else {
        output = "Syntax Error: Use ~" + commands.deleteSpell + "  '[spell name]'";
      }
      msg.reply(output);
      break;

    case commands.giveSpell:
      params = userCmd.split("'");

      if(params.length > 3 && params.length < 6) { 
        giveSpell(params[1], params[3]);
      } else {
        output = "Syntax Error: use ~" + commands.giveSpell + "  '[character name]'  '[spell name]'";
      }
      msg.reply(output);
      break;

    case commands.takeSpell:
      params = userCmd.split("'");
      if(params.length > 3 && params.length < 6){ 
        takeSpell(params[1], params[3]);
      } else {
        output = "Syntax Error: use ~" + commands.takeSpell + "  '[character name]'  '[spell name]'";
      }
      msg.reply(output);
      break;

    case commands.spellInfo:
      params = userCmd.split("'");
      if (params.length === 2 || params.length === 3){ 
        spellInfo(params[1]);
      } else {
        output = "Syntax Error: Use ~" + commands.spellInfo + "  '[spell name]'";
      }
      msg.reply(output);
      break;

    case commands.setSpellInfo:
      params = userCmd.split("'");
      if (params.length > 2){
        let index = 0;
        for(let i = 0; i < 2; i++) index = userCmd.indexOf("'", index+1);
        let ending = userCmd.slice(index);
        let column = ending.split(" ");
        if (column.length < 3){
          output = "Syntax Error: Use ~" + commands.setSpellInfo + "  '[spell name]'  [desc|damage|type|level|components]  [value]";
          msg.reply(output);
          break;
        }

        if(column[1] === "spell_id" || column[1] === "name"){
          output = "Nice try, bucko.";
          msg.reply(output);
          break;
        }

        let value = column[2];
        for(let i = 3; i < column.length; i++){
          value += " " + column[i];
        }

        setSpellInfo(column[1], value, params[1]);
      } else {
        output = "Syntax Error: Use ~" + commands.setSpellInfo + "  '[spell name]'  [desc|damage|type|level|components]  [value]";
      }
      msg.reply(output);
      break;

    default:
      msg.reply('Error: Not a valid command. Use ~help for a list of commands.');
    }
});

function columnExists(tableName, columnName) {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
  return columns.some(column => column.name === columnName);
}

function getCharID(charName){
  let char_id = -1;
  const row = db.prepare('SELECT char_id FROM characters WHERE name = ? COLLATE NOCASE').get(charName); // query char_id
  if(row){
    char_id = row.char_id;
  } 
  return char_id;
}

function getItemID(itemName){
  let item_id = -1;
  const row = db.prepare('SELECT item_id FROM items WHERE name = ? COLLATE NOCASE').get(itemName); // query item_id
  if(row) item_id = row.item_id;
  return item_id;
}

function getWeaponID(weaponName){
  let weapon_id = -1;
  const row = db.prepare('SELECT weapon_id FROM weapons WHERE name = ? COLLATE NOCASE').get(weaponName); // query weapon_id
  if(row) weapon_id = row.weapon_id;
  return weapon_id;
}

function getSpellID(spellName){
  let spell_id = -1;
  const row = db.prepare('SELECT spell_id FROM spells WHERE name = ? COLLATE NOCASE').get(spellName); // query spell_id
  if(row) spell_id = row.spell_id;
  return spell_id;
}

function listCharacters(){
  const stmt = db.prepare('SELECT name FROM characters');
  const charList = stmt.all();
  
  for (let i = 0; i < charList.length; i++){
    output += "'" + charList[i].name + "'";
    if (i !== charList.length-1){
      output += ", ";
    }
  }
}

function addCharacter(charName){
  const charStmt = db.prepare(`INSERT INTO characters (name, level) VALUES (?,?)
    ON CONFLICT(name)
    DO NOTHING;
  `); 
  const info = charStmt.run(charName,1);
  
  if(info.changes > 0) {
    output = "Welcome to the party, " + charName + "!";

    let char_id = getCharID(charName);

    const statStmt = db.prepare('INSERT INTO stats (char_id) VALUES (?);');
    statStmt.run(char_id);
  } else {
    setCharacterInfo("name", charName, charName);
  }
}

function deleteCharacter(charName){
  let char_id = getCharID(charName);

  if(char_id >= 0){
    output = "Goodbye, " + charName + "!";
  } else {
    output = "Error: No character named " + charName + " found."
    return;
  }

  const charStmt = db.prepare('DELETE FROM characters WHERE char_id = ?'); 
  const statStmt = db.prepare('DELETE FROM stats WHERE char_id = ?'); 
  const itemStmt = db.prepare('DELETE FROM character_items WHERE char_id = ?');
  const weaponStmt = db.prepare('DELETE FROM character_weapons WHERE char_id = ?'); 
  const spellStmt = db.prepare('DELETE FROM character_spells WHERE char_id = ?'); 

  charStmt.run(char_id);
  statStmt.run(char_id);
  itemStmt.run(char_id);
  weaponStmt.run(char_id);
  spellStmt.run(char_id);
}

function characterInfo(charName){
  let char_id = getCharID(charName);
  if (char_id >= 0){
    const row = db.prepare('SELECT * FROM characters WHERE char_id = ?').get(char_id);
    values = getNonNullValues(row);

    let opening = false;
    output = values.name;
    if(values.level || values.race || values.class){ 
      output += " is a";
      opening = true;
    }
    //figure out the grammar of the output string
    if(values.level) output += " level " + values.level;
    if(values.race) output += " " + values.race;
    if(values.class) output += " " + values.class;
    if(opening && (values.height || values.weight || values.age)) output += " who";
    if(values.height || values.weight || values.age) output += " is";
    if(values.height) output += " " + values.height;
    if(values.height && (values.height || values.weight)) output += ",";
    if(values.weight) output += " " + values.weight;
    if(values.age && (values.height || values.weight)) output += " and";
    if(values.age) output += " " + values.age + " years old";
    output += ".";
  } else {
    output = "Error: No character named " + charName + " found.";
  }
}

function setCharacterInfo(column, value, charName){ 
  if(columnExists('characters', column)){
    let char_id = getCharID(charName);
    if (char_id >= 0){
      const charStmt = db.prepare(`UPDATE characters
        SET ${column} = ?
        WHERE char_id = ?;
      `); 
      charStmt.run(value, char_id);
      output = charName + "'s " + column + " is now " + value + ".";
    } else {
      output = "Error: No character named " + charName + " found.";
    }
  } else {
    output = "Error: No characteristic named " + column + " found.";
  }
}

function characterStats(charName){
  output = "";
  let char_id = getCharID(charName);
  if (char_id >= 0){
    const row = db.prepare('SELECT * FROM stats WHERE char_id = ?').get(char_id);
    values = getNonNullValues(row);
    numStats = Object.keys(values).length-2;

    if(numStats === 0) {
      output += charName + " hasn't input any stats yet.";
      return;
    }
    output += charName + " has";
    
    //figure out the grammar of the output string
    numStats = statFormat(values.str, "Str", numStats);
    numStats = statFormat(values.dex, "Dex", numStats);
    numStats = statFormat(values.con, "Con", numStats);
    numStats = statFormat(values.int, "Int", numStats);
    numStats = statFormat(values.wis, "Wis", numStats);
    numStats = statFormat(values.cha, "Cha", numStats);
    numStats = statFormat(values.speed, "Speed", numStats);
    numStats = statFormat(values.max_hp, "Max HP", numStats);

    output += ".";
  } else {
    output = "Error: No character named " + charName + " found.";
  }
}

function statFormat(value, abbr, numStats){
  if(value){ 
    output += " " + value + " " + abbr; 
    numStats -= 1;
    if(numStats === 1) output += " and";
  }
  if(numStats > 1) output += ",";
  
  return numStats;
}

function setCharacterStat(column, value, charName){
  if(columnExists('stats', column)){
    let char_id = getCharID(charName);
    if (char_id >= 0){
      const charStmt = db.prepare(`UPDATE stats
        SET ${column} = ?
        WHERE char_id = ?;
      `); 
      charStmt.run(value, char_id);
      output = charName + "'s " + column + " is now " + value + ".";
    } else {
      output = "Error: No character named " + charName + " found.";
    }
  } else {
    output = "Error: No stat named " + column + " found.";
  }
}

function characterItems(charName){
  let charID = getCharID(charName);

  const stmt = db.prepare('SELECT * FROM character_items WHERE char_id = ?');
  const itemList = stmt.all(charID);
  
  if (itemList.length === 0) {
    output = charName + " doesn't have any items in their inventory.";
    return;
  } 

  output = charName + " has";
  for(let i = 0; i < itemList.length; i++){
    const itemRow = db.prepare('SELECT name FROM items WHERE item_id = ?').get(itemList[i].item_id);
    output += " " + itemList[i].quantity + " " + itemRow.name;
    if(itemList[i].quantity > 1) output += "s";
    if(!(i === itemList.length-1) && itemList.length > 2) output += ",";
    if(i === itemList.length-2) output += " and";
  }
  output += ".";
}

function characterWeapons(charName){
  let charID = getCharID(charName);

  const stmt = db.prepare('SELECT * FROM character_weapons WHERE char_id = ?');
  const weaponList = stmt.all(charID);
  
  if (weaponList.length === 0) {
    output = charName + " doesn't have any weapons in their inventory.";
    return;
  } 

  output = charName + " has";
  for(let i = 0; i < weaponList.length; i++){
    const weaponRow = db.prepare('SELECT name FROM weapons WHERE weapon_id = ?').get(weaponList[i].weapon_id);
    output += " " + weaponRow.name;
    if(!(i === weaponList.length-1) && weaponList.length > 2) output += ",";
    if(i === weaponList.length-2) output += " and";
  }
  output += ".";
}

function characterSpells(charName){
  let charID = getCharID(charName);

  const stmt = db.prepare('SELECT * FROM character_spells WHERE char_id = ?');
  const spellList = stmt.all(charID);
  
  if (spellList.length === 0) {
    output = charName + " doesn't know any spells.";
    return;
  } 

  output = charName + " knows";
  for(let i = 0; i < spellList.length; i++){
    const spellRow = db.prepare('SELECT name FROM spells WHERE spell_id = ?').get(spellList[i].spell_id);
    output += " " + spellRow.name;
    if(!(i === spellList.length-1) && spellList.length > 2) output += ",";
    if(i === spellList.length-2) output += " and";
  }
  output += ".";
}

function listItems(){
  const stmt = db.prepare('SELECT name FROM items');
  const itemList = stmt.all();
  
  for (let i = 0; i < itemList.length; i++){
    output += "'" + itemList[i].name + "'";
    if (i !== itemList.length-1){
      output += ", ";
    }
  }
}

function addItem(itemName){
  const itemStmt = db.prepare(`INSERT INTO items (name) VALUES (?)
    ON CONFLICT(name)
    DO NOTHING;
  `); 
  const info = itemStmt.run(itemName);
  
  if(info.changes > 0) {
    output = "Successfully added " + itemName + " to the item pool!";
  } else {
    setItemInfo("name", itemName, itemName);
  }
}

function deleteItem(itemName){
  let item_id = getItemID(itemName);

  if(item_id >= 0){
    output = itemName + " has been removed from the item pool.";
  } else {
    output = "Error: No item named " + itemName + " found."
    return;
  }
  const stmt = db.prepare('DELETE FROM items WHERE item_id = ?');
  const itemStmt = db.prepare('DELETE FROM character_items WHERE item_id = ?');

  stmt.run(item_id);
  itemStmt.run(item_id);
}

function giveItem(charName, itemName, quantity){
  let charID = getCharID(charName); 
  if(charID < 0){
   output = "Error: No character named " + charName + " found.";
   return;
  }
  
  let itemID = getItemID(itemName)
  if(itemID < 0){
   output = "Error: No item named " + itemName + " found.";
   return;
  }

  const itemRow = db.prepare('SELECT ci_id FROM character_items WHERE char_id = ? AND item_id = ?;').get(charID, itemID);

  if(itemRow) { //item already exists in inventory
    const inventory = db.prepare('SELECT quantity FROM character_items WHERE ci_id = ?;').get(itemRow.ci_id);
    let total = inventory.quantity;
    total += quantity;
    let updateStmt = db.prepare('UPDATE character_items SET quantity = ? WHERE ci_id = ?;');
    updateStmt.run(total, itemRow.ci_id);

    output = charName + " now has " + total + " " + itemName;
    if(total > 1) output += "s";
    output += " in their inventory.";
  } else { //just insert quantity into inventory
    let giveStmt = db.prepare('INSERT INTO character_items(char_id, item_id, quantity) VALUES (?,?,?);');
    giveStmt.run(charID, itemID, quantity);
    output = charName + " now has " + quantity + " " + itemName;
    if(quantity > 1) output += "s";
    output += " in their inventory.";
  }
}

function takeItem(charName, itemName, quantity){
  let charID = getCharID(charName); 
  if(charID < 0){
   output = "Error: No character named " + charName + " found.";
   return;
  }
  
  let itemID = getItemID(itemName)
  if(itemID < 0){
   output = "Error: No item named " + itemName + " found.";
   return;
  }

  const itemRow = db.prepare('SELECT ci_id FROM character_items WHERE char_id = ? AND item_id = ?;').get(charID, itemID);

  if(itemRow) { //item already exists in inventory
    const inventory = db.prepare('SELECT quantity FROM character_items WHERE ci_id = ?;').get(itemRow.ci_id);
    let total = inventory.quantity;
    total -= quantity;

    if(total < 1){ //none left, delete from inventory
      output = charName + " only had " + inventory.quantity + " " + itemName;
      if(inventory.quantity > 1) output += "s";
      output += " in their inventory, and now has none left.";
      let deleteStmt = db.prepare('DELETE FROM character_items WHERE ci_id = ?;');
      deleteStmt.run(itemRow.ci_id);
    } else { //still some items left, update with new quantity
      output = charName + " now has " + total + " " + itemName;
      if(total > 1) output += "s";
      output += " in their inventory.";

      let updateStmt = db.prepare('UPDATE character_items SET quantity = ? WHERE ci_id = ?;');
      updateStmt.run(total, itemRow.ci_id);
    }
  } else { //None in inventory
    output = "Error: " + charName + " doesn't have any " + itemName + "s in their inventory.";
  }
}

function itemInfo(itemName){
  output = "";
  let item_id = getItemID(itemName);
  if (item_id >= 0){
    const row = db.prepare('SELECT * FROM items WHERE item_id = ?').get(item_id);
    values = getNonNullValues(row);
    numInfo = Object.keys(values).length-2;

    if(numInfo === 0) {
      output += itemName + " doesn't have any info yet.";
      return;
    }
    
    output = values.name + "'s"; //figure out the grammar of the output string
    if(values.weight) {output += " weight is " + values.weight; numInfo -= 1;}
    if(values.weight && numInfo > 1) {output += ",";}
    if(values.weight && numInfo === 1) output += " and";
    if(values.cost){output += " cost is " + values.cost; numInfo -= 1;}
    if(numInfo > 0 &&  values.cost) output += " and";
    if(values.desc) output += " description is '" + values.desc + "'";
    output += "."
  } else {
    output = "Error: No item named " + itemName + " found.";
  }
}

function setItemInfo(column, value, itemName){ 
  if(columnExists('items', column)){
    let item_id = getItemID(itemName);
    if (item_id >= 0){
      const itemStmt = db.prepare(`UPDATE items
        SET ${column} = ?
        WHERE item_id = ?;
      `); 
      itemStmt.run(value, item_id);
      output = itemName + "'s " + column + " is now " + value + ".";
    } else {
      output = "Error: No item named " + itemName + " found.";
    }
  } else {
    output = "Error: No item characteristic named " + column + " found.";
  }
}

function getNonNullValues(row){
  const nonNullValues = Object.fromEntries(
  Object.entries(row).filter(([key, value]) => value !== null)
  );

  return nonNullValues;
}

function listWeapons(){
  const stmt = db.prepare('SELECT name FROM weapons');
  const weaponList = stmt.all();
  
  for (let i = 0; i < weaponList.length; i++){
    output += "'" + weaponList[i].name + "'";
    if (i !== weaponList.length-1){
      output += ", ";
    }
  }
}

function addWeapon(weaponName){
  const weaponStmt = db.prepare(`INSERT INTO weapons (name) VALUES (?)
    ON CONFLICT(name)
    DO NOTHING;
  `); 
  const info = weaponStmt.run(weaponName);
  
  if(info.changes > 0) {
    output = "Successfully added " + weaponName + " to the weapon pool!";
  } else {
    setWeaponInfo("name", weaponName, weaponName); 
  }
}

function deleteWeapon(weaponName){
  let weapon_id = getWeaponID(weaponName);

  if(weapon_id >= 0){
    output = weaponName + " has been removed from the weapon pool.";
  } else {
    output = "Error: No weapon named " + weaponName + " found."
    return;
  }
  const stmt = db.prepare('DELETE FROM weapons WHERE weapon_id = ?');
  const weaponStmt = db.prepare('DELETE FROM character_weapons WHERE weapon_id = ?');

  stmt.run(weapon_id);
  weaponStmt.run(weapon_id);
}

function giveWeapon(charName, weaponName){
  let charID = getCharID(charName); 
  if(charID < 0){
   output = "Error: No character named " + charName + " found.";
   return;
  }
  
  let weaponID = getWeaponID(weaponName)
  if(weaponID < 0){
   output = "Error: No weapon named " + weaponName + " found.";
   return;
  }

  const weaponRow = db.prepare('SELECT cw_id FROM character_weapons WHERE char_id = ? AND weapon_id = ?;').get(charID, weaponID);

  if(weaponRow) { //weapon already exists in inventory
    output = charName + " already has " + weaponName + " in their inventory.";
  } else { //just insert into inventory
    let giveStmt = db.prepare('INSERT INTO character_weapons(char_id, weapon_id) VALUES (?,?);');
    giveStmt.run(charID, weaponID);
    output = charName + " now has " + weaponName + " in their inventory.";
  }
}

function takeWeapon(charName, weaponName){
  let charID = getCharID(charName); 
  if(charID < 0){
   output = "Error: No character named " + charName + " found.";
   return;
  }
  
  let weaponID = getWeaponID(weaponName)
  if(weaponID < 0){
   output = "Error: No weapon named " + weaponName + " found.";
   return;
  }

  const weaponRow = db.prepare('SELECT cw_id FROM character_weapons WHERE char_id = ? AND weapon_id = ?;').get(charID, weaponID);
  if(weaponRow) { //weapon exists in inventory
    let deleteStmt = db.prepare('DELETE FROM character_weapons WHERE cw_id = ?;');
    deleteStmt.run(weaponRow.cw_id);
    output = charName + " no longer has " + weaponName + " in their inventory.";
  } else { //not in inventory
    output = "Error: " + charName + " doesn't have " + weaponName + " in their inventory.";
  }
}

function weaponInfo(weaponName){
  output = "";
  let weapon_id = getWeaponID(weaponName);
  if (weapon_id >= 0){
    const row = db.prepare('SELECT * FROM weapons WHERE weapon_id = ?').get(weapon_id);
    values = getNonNullValues(row);
    numInfo = Object.keys(values).length-2;

    if(numInfo === 0) {
      output += weaponName + " doesn't have any info yet.";
      return;
    }
    
    output = values.name + "'s"; //figure out the grammar of the output string
    if(values.weight) {output += " weight is " + values.weight; numInfo -= 1;}
    if(values.weight && numInfo > 1) {output += ",";}
    if(values.weight && numInfo === 1) output += " and";
    if(values.damage){output += " damage is " + values.damage; numInfo -= 1;}
    if(numInfo > 0 && values.damage) output += " and";
    if(values.desc) output += " description is '" + values.desc + "'";
    output += "."
    
  } else {
    output = "Error: No weapon named " + weaponName + " found.";
  }
}

function setWeaponInfo(column, value, weaponName){ 
  if(columnExists('weapons', column)){
    let weapon_id = getWeaponID(weaponName); 
    if (weapon_id >= 0){
      const weaponStmt = db.prepare(`UPDATE weapons
        SET ${column} = ?
        WHERE weapon_id = ?;
      `); 
      weaponStmt.run(value, weapon_id);
      output = weaponName + "'s " + column + " is now " + value + ".";
    } else {
      output = "Error: No weapon named " + weaponName + " found.";
    }
  } else {
    output = "Error: No weapon characteristic named " + column + " found.";
  }
}

function listSpells(){
  const stmt = db.prepare('SELECT name FROM spells');
  const spellList = stmt.all();
  
  for (let i = 0; i < spellList.length; i++){
    output += "'" + spellList[i].name + "'";
    if (i !== spellList.length-1){
      output += ", ";
    }
  }
}

function addSpell(spellName){
  const spellStmt = db.prepare(`INSERT INTO spells (name) VALUES (?)
    ON CONFLICT(name)
    DO NOTHING;
  `); 
  const info = spellStmt.run(spellName);
  
  if(info.changes > 0) {
    output = "Successfully added " + spellName + " to the spell list!";
  } else {
    setSpellInfo("name", spellName, spellName); 
  }
}

function deleteSpell(spellName){
  let spell_id = getSpellID(spellName); //ADD

  if(spell_id >= 0){
    output = spellName + " has been removed from the spell list.";
  } else {
    output = "Error: No spell named " + spellName + " found."
    return;
  }
  const stmt = db.prepare('DELETE FROM spells WHERE spell_id = ?');
  const spellStmt = db.prepare('DELETE FROM character_spells WHERE spell_id = ?');

  stmt.run(spell_id);
  spellStmt.run(spell_id);
}

function giveSpell(charName, spellName){
  let charID = getCharID(charName); 
  if(charID < 0){
   output = "Error: No character named " + charName + " found.";
   return;
  }
  
  let spellID = getSpellID(spellName)
  if(spellID < 0){
   output = "Error: No spell named " + spellName + " found.";
   return;
  }

  const spellRow = db.prepare('SELECT cs_id FROM character_spells WHERE char_id = ? AND spell_id = ?;').get(charID, spellID);
  if(spellRow) { //spell already exists in spell list
    output = charName + " already knows " + spellName + ".";
  } else { //just insert
    let giveStmt = db.prepare('INSERT INTO character_spells(char_id, spell_id, ready) VALUES (?,?,?);');
    giveStmt.run(charID, spellID, "is");
    output = charName + " now knows " + spellName + ".";
  }
}

function takeSpell(charName, spellName){
  let charID = getCharID(charName); 
  if(charID < 0){
   output = "Error: No character named " + charName + " found.";
   return;
  }
  
  let spellID = getSpellID(spellName)
  if(spellID < 0){
   output = "Error: No spell named " + spellName + " found.";
   return;
  }

  const spellRow = db.prepare('SELECT cs_id FROM character_spells WHERE char_id = ? AND spell_id = ?;').get(charID, spellID);
  if(spellRow) { //spell is known
    let deleteStmt = db.prepare('DELETE FROM character_spells WHERE cs_id = ?;');
    deleteStmt.run(spellRow.cs_id);
    output = charName + " no longer knows " + spellName + ".";
  } else { //not known
    output = "Error: " + charName + " doesn't know " + spellName + ".";
  }
}

function spellInfo(spellName){
  output = "";
  let spell_id = getSpellID(spellName);
  if (spell_id >= 0){
    const row = db.prepare('SELECT * FROM spells WHERE spell_id = ?').get(spell_id);
    values = getNonNullValues(row);
    numInfo = Object.keys(values).length-2;

    if(numInfo === 0) {
      output += spellName + " doesn't have any info yet.";
      return;
    }
    
    output = values.name; //figure out the grammar of the output string
    if(values.level && values.type) {output += " is a level " + values.level + " " + values.type + " spell"; numInfo -= 1;}
    else if(values.level) {output += " is a level " + values.level + " spell"; numInfo -= 1;}
    else if (values.type) {output += " is a " + values.type + " spell"; numInfo -= 1;}
    if((values.level||values.type) && numInfo > 0) output += ",";
    if(values.damage) {
      if(numInfo === 1 && (Object.keys(values).length-2) > 1) output += " and";
      output += " deals " + values.damage + " damage"; numInfo -= 1;
      if(numInfo > 0) output += ",";
    }
    if(values.components) {
      if(numInfo === 1 && (Object.keys(values).length-2) > 1) output += " and";
      output += " requires " + values.components + " to cast"; numInfo -= 1;
      if(numInfo > 0) output += ",";
    }
    if(values.desc) {
      if((Object.keys(values).length-2) > 1) output += " and";
      output += " has the description '" + values.desc + "'";
    }
    
    output += "."
    
  } else {
    output = "Error: No spell named " + spellName + " found.";
  }
}

function setSpellInfo(column, value, spellName){ 
  if(columnExists('spells', column)){
    let spell_id = getSpellID(spellName); 
    if (spell_id >= 0){
      const spellStmt = db.prepare(`UPDATE spells
        SET ${column} = ?
        WHERE spell_id = ?;
      `); 
      spellStmt.run(value, spell_id);
      output = spellName + "'s " + column + " is now " + value + ".";
    } else {
      output = "Error: No spell named " + spellName + " found.";
    }
  } else {
    output = "Error: No spell characteristic named " + column + " found.";
  }
}


process.on('SIGINT', () => { //close the app
  console.log('SIGINT signal received: Closing DB connections');
  db.close((err) => {
    if (err) return console.error(err.message);
    process.exit(0);
  });
});

process.on('SIGTERM', () => { //close the app
  console.log('SIGTERM signal received: Closing DB connections');
  db.close((err) => {
    if (err) return console.error(err.message);
    process.exit(0);
  });
});