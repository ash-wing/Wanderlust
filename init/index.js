const mongoose = require("mongoose");
const initData = require ("./data.js");
const listing = require("../models/listing.js")


const mongourl = "mongodb://127.0.0.1:27017/wanderlust";

//calling the main function
main().then(()=>{
    console.log("Connected to Db");
}).catch((err)=>{
    console.log(err)
})


async function main() {
    await mongoose.connect(mongourl);
}


//initialize database

const initDb = async() =>{
    await listing.deleteMany({}); //If there is any earlier data then clean it
    initData.data = initData.data.map((obj)=> ({ ...obj, owner: "66d7f3862de40220a8a233e6"}))
    await listing.insertMany(initData.data); //now insert it
    console.log("data initialized")
}

initDb()