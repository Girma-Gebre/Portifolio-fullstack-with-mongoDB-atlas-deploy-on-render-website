require('dotenv').config(); // to config the .env file 
const express = require("express");
const mongoose = require('mongoose'); 
const router = express.Router();
const Autoincrement = require("mongoose-sequence")(mongoose); // import the autoincrement as-built module
// connect the serer (node Js) with mongoDB atlas
mongoose.connect(process.env.MONGO_URL, {family: 4})
.then(()=>console.log("Conneted to MongoDB Atlas"))
.catch(err=>console.error('Connection failed', err)) 


// create shema
const employerSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    comment: {type: String, required: true}    
}); 

 //---------insert "User_id" field and make autoincrement for each data inserted from client/fromtend-------
//--------inc_field is plugin expexted object key
// ---- Always apply the plugin before creating the model:
employerSchema.plugin(Autoincrement, {inc_field: "sidejobsID"}); 
// creating "sidejobsID" field in the collection of "counter" in the mongoDB atlas to auto increment the value of "sidejobsId" for each document inserted in the "sidejobs" collection in monngoDB database. This is the identification name for each database document.
const employer = mongoose.model("sideJob", employerSchema); 
// This is making "sideJob" collection in the mongoDB database and the noame of the collection is the same as the model name but in lowercase and plural form by defualt.
async function resetCounterIfEmpty() {
  const count = await employer.countDocuments(); // this shows the valoue of seq in counters collection it indicates the heighest "sideJobID" or the number of documents in the "sidejobs" collection in mongoDB database
  if (count === 0) {
    // Reset the counter for "UserId"
    await mongoose.connection.collection("sideJobsResetSeq").updateOne( // SideJobCounter is the name of the database collection in mongoDb atlas use to reset the value of "sideJobID" for each document in the "sidejpbs" database collection in mongoDb atlas if we remove the document with the "id: sideJobID" from "counters" database, it (counters) is created automathically when the client insert at first time.
      { _id: `${employer.collection.name}_UserID` }, // to indicate the name of the collection and its field name. 
      { $set: { seq: 0 } },
      { upsert: true } // insert if it is not exist update if it is exixt
    );
  }
}

router.post("/sidejob", async (req,res)=>{
    try{
    const nameNoExtraSpace = req.body.name.trim().replace(/\s+/g, " "); //avoiding extra space from name from client/frontend  
    const {email, comment} = req.body;
    // finde the email or name
    const existingData = await employer.findOne({
         $or: [
               {name: {$regex: `^${nameNoExtraSpace}$`, $options: "i" }},
                {email: email}
             ]
             });

    if (existingData) {
      const sameName = existingData.name.toLowerCase() === nameNoExtraSpace.toLowerCase();
      const sameEmail = existingData.email === email

     if (sameName && sameEmail) {
      return res.json({ Msg: "Your name and email are already exist!" });
      } else if (sameName) {
      return res.json({ Msg: "Your name is already exists!" });
       } else if (sameEmail) {
      return res.json({ Msg: "Your email is already exists!" });
      }
     }
        
        await resetCounterIfEmpty() //calling the function to reset the "UserId"
      // create an instance object template from class and insert data from client e.g: req.body
        const newEmployer = new employer({name: nameNoExtraSpace, email, comment}); // creating object from class
       await newEmployer.save(); // enable the data to save by mongoose and send to mongoDB as BJSON data type.
        res.status(200).json({ Msg: "Data is submitted successfully" }); // ✅send JSON this is manadatory to work the front end correctly nice!
          
    }catch(err){
      console.log(err);
        res.status(500).json({Msg: "internal server error or problem on database connection"});
    }
});


module.exports = router;