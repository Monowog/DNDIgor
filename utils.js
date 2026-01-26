
function list(db, tableName){
  let output = "";
  const stmt = db.prepare(`SELECT name FROM ${tableName}`);
  const list = stmt.all();
  
  for (let i = 0; i < list.length; i++){
    output += "'" + list[i].name + "'";
    if (i !== list.length-1){
      output += ", ";
    }
  }

  if(output === "") {
    if(tableName === "characters") output = "There are currently no characters in the party.";
    if(tableName === "items") output = "There are currently no items in the pool.";
    if(tableName === "weapons") output = "There are currently no weapons available.";
    if(tableName === "spells") output = "There are currently no spells on the spell list";
  }

  return output;
}

function getID(tableName, idType, elemName){
  
}

module.exports = {
  list,
};