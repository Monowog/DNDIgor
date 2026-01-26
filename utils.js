
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

function getID(db, tableName, idType, elemName){
  let id = -1;
  const row = db.prepare(`SELECT ${idType} FROM ${tableName} WHERE name = ? COLLATE NOCASE`).get(elemName); // query id
  if(row){
    id = row[idType];
  } 
  return id;
}

function columnExists(db, tableName, columnName) {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
  return columns.some(column => column.name === columnName);
}

function getNonNullValues(row){
  const nonNullValues = Object.fromEntries(
  Object.entries(row).filter(([key, value]) => value !== null)
  );

  return nonNullValues;
}

function setInfo(db, tableName, idType, elemName, column, value, first){
  if(columnExists(db, tableName, column)){
    let id = getID(db, tableName, idType, elemName);
    if (id >= 0){
      const stmt = db.prepare(`UPDATE ${tableName}
        SET ${column} = ?
        WHERE ${idType} = ?;
      `); 
      stmt.run(value, id);
      if(first) output = elemName + "'s " + column + " is now " + value;
      if(!first) output = ", " + column + " is now " + value;
    } else {
      output = `Error: No ${tableName} named ` + elemName + " found.";
    }
  } else {
    output = "Error: No characteristic named " + column + " found.";
  }
  return output;
}

module.exports = {
  list,
  getID,
  getNonNullValues,
  setInfo,
};