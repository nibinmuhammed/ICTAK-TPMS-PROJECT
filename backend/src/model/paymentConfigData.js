const mongoose = require('mongoose');
const dbUrl = "mongodb+srv://ictkgrp2:adfns@cluster0.na0iher.mongodb.net/TPMSDB";
const connectionParams ={
    useNewUrlParser :true,
    useUnifiedTopology:true
};

mongoose.connect(dbUrl,connectionParams)
.then(()=>{
    console.log("Database connected");
})
.catch(()=>{
    console.log("error");
})
const Schema = mongoose.Schema;

var paymentConfigSchema = new Schema({
    paymentConfigId : Number,
    trainerType : String,
    trainingMode: String,
    isExtraActivity : String,
    noOfStudents : String,
    paymentAmt : Number,
    createdAt: {type: Date, default: Date.now},
});

var paymentconfigdata = mongoose.model('paymentconfigdata', paymentConfigSchema);                        

module.exports = paymentconfigdata;