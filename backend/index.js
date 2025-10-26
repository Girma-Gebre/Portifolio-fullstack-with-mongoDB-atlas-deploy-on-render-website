require("dotenv").config();
const cors = require('cors');
const express = require('express');
const postRouter = require('./crude operation/router-post')
const APP = express();
const path = "C:/Users/0/Desktop/Projects for remote jobs/Full stack web developer/Portifolio fullstack with mongoDB atlas/frontend" // frontend path
APP.use(express.static(path)); // keeping files in the public folder
const port = 2000;
APP.use(cors())
// APP.use(express.static); // keeping files in the public folder
APP.use(express.json()); // to handle the json() caming data
APP.use(express.urlencoded({extended: true})); 
APP.use('/',postRouter); // enable the router to run

APP.listen(process.env.PORT || port,()=>{
    console.log("Server is running")       
})         