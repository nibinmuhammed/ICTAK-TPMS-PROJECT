const mongoose = require('mongoose');
const dbUrl = "mongodb+srv://ictkgrp2:adfns@cluster0.na0iher.mongodb.net/TPMSDB";
const connectionParams ={
    useNewUrlParser :true,
    useUnifiedTopology:true
};

mongoose.connect(dbUrl,connectionParams)
.then(()=>{
    console.log("Timesheet Database connected");
})
.catch(()=>{
    console.log("error");
})
const Schema = mongoose.Schema;

var NewCredentialSchema = new Schema({
  
    date: { type: Date, formattedDate: { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$date" } } },
    program_name: String,
    training_mode: String,
    activity: String,
    hours: Number,
    students: Number,
    user_id: String,
    status: String,
    paymentAmt:Number,
    calculatedAmt:Number,
    trainerType:String
   
});

var TimesheetData = mongoose.model('timesheetdata', NewCredentialSchema);                        //UserData is the model and NewBookData is the schema

module.exports = TimesheetData;