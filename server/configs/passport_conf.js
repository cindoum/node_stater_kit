var passport =    require('passport'),
    mongoose =    require('mongoose'),
    constant =    require('./constants.js'),
    mongoStore =  require('connect-mongo');

module.exports = function (app, db, express) {
    var User = mongoose.model('User');
    var store = mongoStore(express);
    
    passport.use(User.localStrategy);
    //passport.use(User.twitterStrategy());  // Comment out this line if you don't want to enable login via Twitter
    passport.use(User.facebookStrategy()); // Comment out this line if you don't want to enable login via Facebook
    passport.use(User.googleStrategy());   // Comment out this line if you don't want to enable login via Google
    //passport.use(User.linkedInStrategy()); // Comment out this line if you don't want to enable login via LinkedIn
    
    passport.serializeUser(User.serializeUser);
    passport.deserializeUser(User.deserializeUser); 
    
    return passport;
};