require('dotenv').config(); // to config the .env file 
const express = require("express");
const mongoose = require('mongoose'); 
const router = express.Router();
const Autoincrement = require("mongoose-sequence")(mongoose); // import the autoincrement as-built module
// connect the serer (node Js) with mongoDB atlas
mongoose.connect(process.env.MONGO_URL)
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
employerSchema.plugin(Autoincrement, {inc_field: "UserId"}); 
// creating "sideJobs" collection in the mongodb and class for creating an instance object template(data from client e.g: req.body).
const employer = mongoose.model("sideJob", employerSchema); 

// making the userId to be set 1 and autoincrement if there is no documnet in the collection
async function resetCounterIfEmpty() {
  const count = await employer.countDocuments(); // this shows the valoue of seq in counters collection it indicates the heighest "UserId" or the number of documents in the "sidejobs" collection in mongoDB database
  if (count === 0) {
    // Reset the counter for "UserId"
    await mongoose.connection.collection("_counters").updateOne( // _counters is the default mongoose can know
      { _id: `${employer.collection.name}_UserId` }, // match the model name
      { $set: { seq: 0 } },
      { upsert: true } // insert if it is not exist update if it is exixt
    );
  }
}

router.post("/sidejob", async (req,res)=>{
    try{
    const nameNoExtraSpace = req.body.name.replace(/\s+/g, " ").trim(); //avoiding extra space from name from client/frontend  
    const {email, comment} = req.body;
    // finde the email or name
    const existing = await employer.findOne({
         $or: [
               { name: nameNoExtraSpace },
              { email: email }
             ]
             });

    if (existing) {
     if (existing.name.toLowerCase() === nameNoExtraSpace.toLowerCase() &&
      existing.email === email) {
      return res.json({ Msg: "Your name and email are already exist!" });
      } else if (existing.name.toLowerCase() === nameNoExtraSpace.toLowerCase()) {
      return res.json({ Msg: "Your name is already exists!" });
       } else if (existing.email === email) {
      return res.json({ Msg: "Your email is already exists!" });
      }
     }
        
        await resetCounterIfEmpty() //calling the function to reset the "UserId"
      // create an instance object template from class and insert data from client e.g: req.body
        const newEmployer = new employer({name: nameNoExtraSpace, email, comment}); // creating object from class
       await newEmployer.save(); // enable the data to save by mongoose and send to mongoDB as BJSON data type.
        res.status(200).json({ Msg: "Data is submitted successfully" }); // ✅send JSON this is manadatory to work the front end correctly nice!
          
    }catch(err){
        res.status(500).json({Msg: "internal server error or problem on database connection"});
    }
});


module.exports = router;