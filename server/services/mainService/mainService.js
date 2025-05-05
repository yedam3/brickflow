const mariaDB = require("../../db/mapper.js");
const { convertObjToQuery } = require("../../utils/converts.js");
const { convertLikeToQuery } = require("../../utils/converts.js");

const countList =  async () => {
    let list = await mariaDB.query('countList')
                    .catch((err) => console.log(err));
    return list;
}

const lineChart = async() => {
    let list = await mariaDB.query('lineChart')
                            .catch((err) => console.log(err));
    return list;                            
}
const barChart = async() => {
    let list = await mariaDB.query('barChart')
                            .catch((err) => console.log(err));
    return list;                        
}
const pieChart = async() => {
    let list = await mariaDB.query('pieChart')
                            .catch((err) => console.log(err));
    return list;                            
}
module.exports={
    countList,
    lineChart,
    barChart,
    pieChart
}