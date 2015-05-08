var express = require('express');
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/twitter');

var userRouter = require('./app/routes/user.routes');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.use('/users', userRouter);


app.listen(8000, function(){
	console.log('Listening on port 8000...');
});

