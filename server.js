var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
var methodOverride = require('method-override');

//middleware++++++++++++++++++
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: "peanutbutterjellytime",
    resave: false,
    saveUninitialized: false
}));
//sessions controller middleware
var sessionsController = require('./controllers/sessions.js');
app.use('/sessions', sessionsController);

//users controller middleware
var usersController = require('./controllers/users.js');
app.use('/users', usersController);

//stories controller middleware
var storiesController = require('./controllers/stories.js');
app.use('/stories', storiesController);

app.get('/', function(req, res){
    console.log(req.session);
    res.render('index.ejs', {
        currentUser: req.session.currentuser
    });
});

app.get('/stories', function(req, res){
    if(req.session.currentuser !== undefined){
        res.send('the party');
    } else {
        res.redirect('/sessions/new')
    }
});

//connections+++++++++++++++++
app.listen(8080, function(){
    console.log("listening");
});

mongoose.connect('mongodb://localhost:27017/auth');

mongoose.connection.once('open', function(){
    console.log('connected to mongo!');
});