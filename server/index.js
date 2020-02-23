const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./config/key');
const cookieSession = require('cookie-session');
const cors = require('cors');
const bodyParser = require('body-parser');

//models
require('./model/user');
require('./model/employees');

const User = mongoose.model('User');

const app = express();

mongoose.connect(keys.mongoURI);

// mongoose.connect('mongodb://localhost/cred', { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });

app.use(cors());
app.use(bodyParser.json());


//authentiction
passport.serializeUser((user,done) => {
	console.log("user",user);
	done(null,user.id)
});

passport.deserializeUser((id,done) => {
	console.log("id ",id);
	User.findById(id)
	.then((user)=>{
		done(null,user)
	})
	
});
passport.use(new GoogleStrategy({
		clientID : keys.googleId,
		clientSecret:keys.googleSecret,
		callbackURL : '/auth/google/callback',
		proxy : true
  },
  async (accessToken,refreshToken,profile,done) => {
    // console.log(profile);
  	const existingUser = await User.findOne({googleId : profile.id})
		if(existingUser)
		{
			return done(null,existingUser);

		}
		const user = await new User({ googleId : profile.id}).save()
		done(null,user);
  })
);


app.use(
	cookieSession({
			  maxAge:30*24*60*60*1000,
			keys : [keys.cookieKey]
			})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
	cookieSession({
			  maxAge:30*24*60*60*1000,
			keys : [keys.cookieKey]
			})
);
app.use(passport.initialize());
app.use(passport.session());

console.log("server called");

//routes
require('./routes/authRoutes')(app);
require('./routes/formRoutes')(app);

app.get('/',(req,res) => {
	res.send({ 'bye' : " bye "});
})

app.listen(5000);