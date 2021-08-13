//requiring all modules
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const multer = require('multer');
var fs = require('fs');
var path = require('path');
const csvtojson = require('csvtojson');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//connecting to database
let db
mongoose.connect(process.env.MONGO,{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=>{
  console.log('Successfully connected to database')
})
.catch((err)=>{
  console.log(err)
})

//multer configuration
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './public/uploads')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
  }
});
var upload = multer({ storage: storage });

const dataSchema = new mongoose.Schema({}, {strict: false})

app.post('/csvUpload', upload.single('csv'), async (req, res)=>{
  try{
    const Data = mongoose.model(req.body.name, dataSchema, req.body.name)
    var csv = path.join(__dirname + '/'+ req.file.path)
    csvtojson()
    .fromFile(csv)
    .then(async (jsonObj)=>{
      const result = await Data.insertMany(jsonObj);
      res.status(201).send(result.length + " documents were inserted");
    })
  }catch(err){
    console.log(err)
  }
});

app.get('/', (req, res)=>{
	res.send("please use postman to post data using '/csvUpload' route")
	})
const port = process.env.PORT || 8000
app.listen(port, ()=>{
  console.log('uploadCSV server running on port '+port)
})
