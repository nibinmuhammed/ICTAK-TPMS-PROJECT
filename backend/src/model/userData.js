const mongoose = require('mongoose');
const dbUrl = "mongodb+srv://ictkgrp2:adfns@cluster0.na0iher.mongodb.net/TPMSDB";
const connectionParams ={
    useNewUrlParser :true,
    useUnifiedTopology:true
};

mongoose.connect(dbUrl,connectionParams)
.then(()=>{
    console.log("UserData Database connected");
})
.catch(()=>{
    console.log("error");
})
const Schema = mongoose.Schema;

var NewCredentialSchema = new Schema({
  
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    trainer_type: String,
    role: String,
    created_on: {type: Date, default:Date.now}
   
});

var UserData = mongoose.model('userdata', NewCredentialSchema);                        //UserData is the model and NewCredentialSchema is the schema

module.exports = UserData;