// Zappem
console.log('Loading dependencies...');

var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	config = require('./config.js'),
	initChecks = require('./initChecks.js')(mongoose, config, app),
	passport = require('passport'),
	flash = require('connect-flash'),
	bodyParser = require('body-parser');


app.mongoose = mongoose;
app.initChecks = initChecks;

app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.set('layout', 'default');
app.use(express.static('public'));
app.use(require('express-session')({ secret: (process.env.KEY || "purplemonkeydishwasher"), resave: false, saveUninitialized: false }));
app.use(flash());
app.use(bodyParser());//.urlencoded({extended: true}));
app.use(passport.initialize());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(passport.session());

express.response.rendr = function(view, data) {
    var ajax = false;
    if(this.req.xhr){
    	ajax = true;
    	console.log('its ajax');
    	data.layout = false;
    }

    var res = this;

    this.render(view, data, function(err, d){
    	console.log(err);
    	if(ajax){
    		res.send(JSON.stringify({
    			html: d
    		}));
    	}else{
    		res.send(d);
    	}
    	//res.send(d);
    });
};

console.log('Reading ./config.js file...');

if(initChecks.isDataProvided()){

	console.log('Connecting to DB...');
	initChecks.connectToDB(function(success){

		if(success){
			var routes = require('./routes.js');
			app.use(function(req, res, next){
				req.isConnected = app.isConnected;
				res.locals.user = req.user;
				routes(req, res, next)
			});
			app.listen(process.env.PORT || 3000);
			console.log('Welcome to Zappem!');
			console.log('You\'re ready to go.');
			console.log('Head to http://localhost:'+(process.env.PORT || 3000));

		}else{
			console.log('Connection to the DB failed');
		}

	});

}else{
	
	app.use(function(req, res){
		res.send('Please fill in your db info and then restart the app');
	});

}