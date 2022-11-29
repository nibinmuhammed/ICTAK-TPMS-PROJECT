const express = require('express');
const path = require('path');  
const cors = require('cors');
var bodyparser=require('body-parser');
const jwt = require('jsonwebtoken');

const UserData = require('./src/model/userData');
const PaymentConfigData = require('./src/model/paymentConfigData');
const Timetabledata = require('./src/model/programeConfiguration');
const TimesheetData = require('./src/model/timesheetData');

const PORT = process.env.PORT || 8080;

var app = new express();
app.use(express.static('./dist/frontend'));
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(bodyparser.json());


function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
      return res.status(401).send('Unauthorized request')    
    }
    let payload = jwt.verify(token, 'secretKey')
    if(!payload) {
      return res.status(401).send('Unauthorized request')    
    }
    req.userId = payload.subject
    next()
  }


  
// ................................................SIGNUP.........................................
app.post('/api/signup',function(req,res){
   
  var userdata = {       
    firstname : req.body.userdata.firstname,
    lastname : req.body.userdata.lastname,
    email : req.body.userdata.email,
    password : req.body.userdata.password,
    trainer_type : req.body.userdata.trainer_type,
    role : 'trainer' 

 }       
 UserData.find()     
      .then(function (user) {
          for(let i=0;i<user.length;i++){        
              if(userdata.email==user[i].email){
                  flag=true;
                  break;
              }
              else{
                  flag=false;
              }
          }
          if(flag){
              res.status(401).send({status:'Username already exist!'});
          }
          else{
              var user = new UserData(userdata);
              user.save();
              res.status(200).send({status:'Registration completed successfully'});
          }
      });  
});

// ................................................LOGIN..........................................
app.post('/api/login', (req, res) => {
  var userData = req.body
  
  var flag=false;
  var userDetails='';
  
      UserData.find()     
      .then(function (user) {
          for(let i=0;i<user.length;i++){        
              if(userData.email_id==user[i].email && userData.pswd==user[i].password){
                  flag=true;
                  userDetails=user[i];
                  break;
              }
              else{
                  flag=false;
              }
          }
          if(flag==true){
            let payload = {subject: userData.email_id+userData.pswd}
            let token = jwt.sign(payload, 'secretKey')
            res.status(200).send({token,userDetails});
        
          }
          else{
            res.status(401).send('Invalid UserName or Password');
          }
      });  
  })


  //................................. Add Payment Configuration ....................... 

  app.post('/api/insertPaymentConfig',function(req,res){
   
    var paymentConfigData = {       
        trainerType : req.body.pymtConfig.trainerType,
        trainingMode : req.body.pymtConfig.trainingMode,
        isExtraActivity : req.body.pymtConfig.isExtraActivity,
        noOfStudents : req.body.pymtConfig.noOfStudents,
        paymentAmt : req.body.pymtConfig.paymentAmt,
   }       
   var pymntConfig = new PaymentConfigData(paymentConfigData);
   pymntConfig.save();
});


//................................. List Payment Configurations ....................... 

app.get('/api/paymentConfigList',function(req,res){
    
  PaymentConfigData.find()
              .then(function(aymentConfigurations){
                  res.send(aymentConfigurations);
              });
});

//................................. Get Payment Payment Configuration ....................... 

app.get('/api/getPaymentConfig:id',  (req, res) => {
  
  const id = req.params.id;
  PaymentConfigData.findOne({"_id":id})
    .then((paymentConfig)=>{
        res.send(paymentConfig);
    });
})

//................................. UpdatePayment Configuration ....................... 


app.put('/api/updatePaymentConfig',(req,res)=>{
  
   id=req.body._id,
   trainerType = req.body.trainerType,
   trainingMode = req.body.trainingMode,
   isExtraActivity = req.body.isExtraActivity,
   noOfStudents = req.body.noOfStudents,
   paymentAmt = req.body.paymentAmt,

   PaymentConfigData.findByIdAndUpdate({"_id":id},
                              {$set:{"trainerType": trainerType,
                              "trainingMode": trainingMode,
                              "isExtraActivity": isExtraActivity,
                              "noOfStudents": noOfStudents,
                              "paymentAmt": paymentAmt
                             }})
 .then(function(){
     res.send();
 })
})

//................................. Delete Payment Configuration .......................
app.delete('/api/removePaymentConfig/:id',(req,res)=>{
   
  id = req.params.id;
  PaymentConfigData.findByIdAndDelete({"_id":id})
  .then(()=>{
      console.log('success')
      res.send();
  })
})
      


//post for programme configuration
app.post('/api/insertProgrameConfig', function(req, res) {



  var timetable = {

      start_date: req.body.data.start_date,
      duration: req.body.data.duration,
      programme_name: req.body.data.programme_name,
      no_of_students: req.body.data.no_of_students

  }

  Timetabledata.find({ start_date: timetable.start_date, programme_name: timetable.programme_name })
      .then((programconfgdata) => {
          if (programconfgdata.length > 0) {
              flag = true;
          } else {
              flag = false
          }

          if (flag) {
              res.status(401).send({ status: 'Program already exist!' });
          } else {
              var timetableTwo = new Timetabledata(timetable);
              timetableTwo.save();
              res.status(200).send({ status: 'Program added successfully' });
          }
      });

});
// 
// get Ptogramme Configuration
app.get('/api/programmeConfigList', function(req, res) {

  Timetabledata.find()
      .then(function(timetable) {

          res.send(timetable);
      });
});
// put Ptogramme Configuration

app.put('/api/updateProgrammeConfig', (req, res) => {

  id = req.body._id,
      start_date = req.body.start_date,
      duration = req.body.duration,
      programme_name = req.body.programme_name,
      no_of_students = req.body.no_of_students


  Timetabledata.findByIdAndUpdate({ "_id": id }, {
          $set: {
              "start_date": start_date,
              "duration": duration,
              "programme_name": programme_name,
              "no_of_students": no_of_students
          }
      })
      .then(function() {
          res.send();
      })
})



// delete Ptogramme Configuration

app.delete('/api/removeProgrammeConfig/:id', (req, res) => {

      id = req.params.id;
      Timetabledata.findByIdAndDelete({ "_id": id })
          .then(() => {

              res.send();
          })
  })
  
  //  Ptogramme Configuration get by id

app.get('/api/getProgrammeConfig/:id', (req, res) => {

  const id = req.params.id;
  Timetabledata.findOne({ "_id": id })
      .then((timetable) => {
          res.send(timetable);
      });
})



    // .....................................ADD TIMESHEET ENTRY..........................................
 
    app.post('/api/insertTimesheet',function(req,res){
      


     PaymentConfigData.find()     
      .then(function (config) {

        var timesheetData= {       
          date : req.body.timesheet.date,
          program_name: req.body.timesheet.program_name,
          training_mode: req.body.timesheet.training_mode,
          activity : req.body.timesheet.activity,
          hours: req.body.timesheet.hours,
          students: req.body.timesheet.students,
          user_id: req.body.timesheet.user_id,
          status: 'pending',
          paymentAmt:req.body.timesheet.calculatedAmt.paymentAmt,
          calculatedAmt:req.body.timesheet.paymentAmt,
          trainerType:req.body.timesheet.trainerType     
     } 
     console.log("config",config);
          for(let i=0;i<config.length;i++){    
              if((timesheetData.training_mode == config[i].trainingMode) && (timesheetData.activity == config[i].isExtraActivity) && (timesheetData.trainerType == config[i].trainerType) ){
                timesheetData.paymentAmt = config[i].paymentAmt;
                console.log("in",timesheetData.paymentAmt);
              }
          }
          console.log("amt",timesheetData.paymentAmt);
          var t_sheet = new TimesheetData(timesheetData);
          t_sheet.save();          
      });  
 
  });

  // ....................................VIEW TIMESHEET LIST.............................................

  app.get('/api/timesheetList/:user_id',function(req,res){
 
    let userid=req.params.user_id;
    TimesheetData.find({user_id:userid,status:'pending'})
                .then(function(timesheetdata){
                    res.send(timesheetdata); 
                });
  });
  
//  ...........GET PGMDATA BY DATE FROM PROGRAM CONFIGURATION DB................................


app.post('/api/pgmBydate', (req, res) => {
  let date_data = req.body.date;
  Timetabledata.find({start_date: date_data})   
    .then((programconfgdata)=> {
      res.status(200).send({programconfgdata})
    }).catch((err)=> {
      console.log('error while fetching program by date', err.message);
    })  
     
  });

  //  ...........GET HOURS BY DATE AND PGM FROM PROGRAM CONFIGURATION DB................................


app.post('/api/hourByDatePgm', (req, res) => {
  let date_data = req.body.date;
  let program_name_data = req.body.pgm;
 
  Timetabledata.find({start_date: date_data, programme_name: program_name_data})   
    .then((programconfgdata)=> {
      res.status(200).send({programconfgdata})
    }).catch((err)=> {
      console.log('error while fetching program by date', err.message);
    })  
     
  });

// .................GET TIMESHEET OF PARTICULAR ID.....................................

app.get('/api/getTimesheet:id',  (req, res) => {
  const id = req.params.id;
  TimesheetData.findOne({"_id":id})
  .then((timesheetdata)=>{
      res.send(timesheetdata);
  });
});

//.....................................UPDATE TIMESHEET..........................................

app.put('/api/updateTimesheet',(req,res)=>{
  id=req.body._id,
  date = req.body.date,
  program_name = req.body.program_name,
  training_mode = req.body.training_mode,
  activity = req.body.activity,
  hours = req.body.hours,
  paymentAmt=req.body.paymentAmt,
  calculatedAmt=req.body.calculatedAmt,
  trainerType=req.body.trainerType


  TimesheetData.findByIdAndUpdate({"_id":id},
                             {$set:{"date": date,
                             "program_name": program_name,
                             "training_mode": training_mode,
                             "activity": activity,
                             "hours": hours,
                            }})
.then(function(){
    res.send();
})
})

//.....................................DELETE TIMESHEET..........................................

app.delete('/api/deleteTimesheet/:id',(req,res)=>{

  id = req.params.id;
  TimesheetData.findByIdAndDelete({"_id":id})
  .then(()=>{
    
      res.send();
  })
});



//TO GET TRAINER LIST

app.get('/api/trainerList',function(req,res){
  
    
  UserData.find({role:'trainer'}).sort("firstname")
              .then(function(userdata){
                  res.send(userdata);         
                });

});

//.............to get timesheets of selected trainer.............

app.get('/api/getUserTimesheets/:user_id',function(req,res){
   
  let userid=req.params.user_id;

  TimesheetData.find({user_id:userid,status:'pending'})
              .then(function(timesheetdata){
                  res.send(timesheetdata);
                 
              });
});

app.get('/api/getCalcUserTimesheets/:user_id',function(req,res){
   
  let userid=req.params.user_id;

  TimesheetData.find({user_id:userid,status:'Calculated'})
              .then(function(timesheetdata){
                  res.send(timesheetdata);
                 
              });
});



app.put('/api/calculatePayment',(req,res)=>{
  userid=req.body.user_id,
  TimesheetData.updateMany({"user_id":userid},
                             {$set:{
                             "status":"Calculated",
                            }})

  
.then(function(){
    res.send();
})
  
})

// ..................Get invoice user...............

app.get('/api/getInvoiceUSer/:id', (req, res) => {
  console.log(req.params.id)
  const id = req.params.id;
  UserData.findOne({ "_id": id })
      .then((invoUdata) => {
          res.send(invoUdata);
          console.log(invoUdata);
      });
})

// .........................Get invoice item................

app.get('/api/getInvoice/:id', (req, res) => {
  console.log(req.params.id)
  const id = req.params.id;
  TimesheetData.find({ user_id:id,status:'Calculated'})
      .then((invoItemdata) => {
          res.send(invoItemdata);
          console.log("eee", invoItemdata);
      });
    });  

//.....................Hosting related.......................

   app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/frontend/index.html'));
   });

app.listen(PORT,()=>{
    console.log(`Server Ready on ${PORT}`);   
});

