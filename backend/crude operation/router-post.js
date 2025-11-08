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
 
// creating "sideJobs" collection in the mongodb and class for creating an instance object template(data from client e.g: req.body).
const employer = mongoose.model("sideJob", employerSchema);

router.post("/sidejob", async (req,res)=>{
    try{
    const nameNoExtraSpace = req.body.name.replace(/\s+/g, " ").trim(); //avoiding extra space from name from client/frontend  
    const nameCaseInsensetive = new RegExp(nameNoExtraSpace, "i") // making variable (containing string) case insensetive using regex
    const {email, comment} = req.body;
    const dataName = await employer.findOne({name:nameCaseInsensetive});
    const dataEmail = await employer.findOne({email});

    //check both name and email are already exist first
      if(dataName && dataEmail){
       return res.json({Msg: "Your name and email are already exist!"})
       }

    //check name is already exist
        if(dataName){
       return res.json({Msg: "Your name is already exists!"})     
        }

    //check email is already exist
        if(dataEmail){
            return res.json({Msg: "Your email is already exists!"})
        }
        
      // create an instance object template from class and insert data from client e.g: req.body
        const newEmployer = new employer({name: nameNoExtraSpace, email, comment}); // creating object from class
       await newEmployer.save(); // enable the data to save by mongoose and send to mongoDB as BJSON data type.
        res.status(200).json({ Msg: "Data is submitted successfully" }); // ✅send JSON this is manadatory to work the front end correctly nice!
          
    }catch(err){
        res.status(500).json({Msg: "internal server error or problem on database connection"});
    }
});


module.exports = router;