const mariaDB = require("../db/mapper.js");

const findAll = async ()=>{
    let list = await mariaDB.query('selectAll')
                .catch((err) => console.log(err));
    return list;
}

module.exports={
    findAll
}