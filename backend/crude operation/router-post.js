require('dotenv').config(); // to config the .env file 
const express = require("express");
const mongoose = require('mongoose'); 
const router = express.Router();
// connect the serer (node Js) with mongoDB atlas
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("Conneted to MongoDB Atlas"))
.catch(err=>console.error('Connection failed', err))
// create shema
const employerSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    comment: {type: String, required: true}   
}); 
 
// creating "employee" collection in the mongodb and class for object templaten(data from client e.g: req.body).
const employer = mongoose.model("sideJob", employerSchema);

router.post("/sidejob", async (req,res)=>{
    try{
    const nameNoExtraSpace = req.body.name.replace(/\s+/g, " ").trim();
    const {email, comment} = req.body;
    const dataName = await employer.findOne({name:nameNoExtraSpace});
    const dataEmail = await employer.findOne({email});

    //check all data existance first
      if(dataName && dataEmail){
       return res.json({Msg: "Your name and email are already exist!"})
       }

    //check name existance
        if(dataName){
       return res.json({Msg: "Your name is already exists!"})     
        }

    //check email existance
        if(dataEmail){
            return res.json({Msg: "Your email is already exists!"})
        }
        

        const newEmployer = new employer({name: nameNoExtraSpace, email, comment}); // creating object from class
       await newEmployer.save(); // enable the data to save by mongoose and send to mongoDB as BJSON data type.
        res.status(200).json({ Msg: "Data is submitted successfully" }); // ✅send JSON this is manadatory to work the front end correctly nice!
          
    }catch(err){
        res.status(500).json({Msg: "internal server error or problem on database connection"});
    }
});


module.exports = router;