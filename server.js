var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');

var userRouter = require('./app/routes/user.routes');

mongoose.connect('mongodb://localhost:27017/twitter');

require('./config/passport')();

app.set('views', './app/views');

app.use(express.static('public'));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
	saveUninitialized: true,
    resave: true,
	secret: 'developmentSessionSecret'
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use('/', userRouter);


app.listen(8000, function(){
	console.log('Listening on port 8000...');
});

