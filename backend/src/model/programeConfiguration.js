const mongoose = require('mongoose');
const dbUrl = "mongodb+srv://ictkgrp2:adfns@cluster0.na0iher.mongodb.net/TPMSDB";
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(dbUrl, connectionParams)
    .then(() => {
        console.log("Database connected");
    })
    .catch(() => {
        console.log("error");
    })
const Schema = mongoose.Schema;

var NewTimetableSchema = new Schema({


    start_date: { type: Date, formattedDate: { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$date" } } },
    duration: String,
    programme_name: String,
    no_of_students: Number

});

var Timetabledata = mongoose.model('timetable', NewTimetableSchema);

module.exports = Timetabledata;