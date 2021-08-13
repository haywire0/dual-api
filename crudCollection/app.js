// Requiring modules
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//mongoose
mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=>{
  console.log('Successfully connected to database')
})
.catch(err=>{
  console.log(err)
  console.log("Database connection error")
});

const controller = require('./controller/user');
const verifyToken = require('./middleware/verifyToken');
const rest = require('./controller/rest')

//SIGNUP AND LOGIN
app.post('/register', controller.Signup);
app.post('/login', controller.Login);
app.get('/', (req, res)=>{
	res.send("please register or login using postman and access crud operations on collections using '/collectionName'. (if you want to perform crud operations on a collection named youtube then access it using '/youtube' route)")
	});
	

//GET
app.get('/:collection', verifyToken, rest.getAll);
app.get('/:collection/:objectId', verifyToken, rest.getOne);

//POST
app.post('/:collection', verifyToken, rest.create);

//PUT
app.put('/:collection/:objectId', verifyToken, rest.put);

//PATCH
app.patch('/:collection/:objectId', verifyToken, rest.patch);

//DELETE
app.delete('/:collection', verifyToken, rest.deleteAll);
app.delete('/:collection/:objectId', verifyToken, rest.deleteOne);
const port = process.env.PORT || 8888
app.listen(port, ()=>{
  console.log('Server started on port ' + port)
});
