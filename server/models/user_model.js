var mongoose =          require( 'mongoose' ),
    bcrypt =            require('bcrypt'),
    SALT =              10,
    passport =          require('passport'),
    LocalStrategy =     require('passport-local').Strategy,
    TwitterStrategy =   require('passport-twitter').Strategy,
    FacebookStrategy =  require('passport-facebook').Strategy,
    GoogleStrategy =    require('passport-google').Strategy,
    LinkedInStrategy =  require('passport-linkedin').Strategy,
    service =           require('../services/user_service'),
    validator =         require('mongoose-unique-validator'),
    constants =         require('../configs/constants.js');
    
var userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: { type: String, required: true, unique: true, index: true },
    password: {type: String },
    email: { type: String, required: true, unique: true, index: true },
    provider: String,
    providerId: String,
    role: {
        bitMask: Number,
        title: String
    }
}, { collection: 'User' });

userSchema.plugin(validator, { message: '{PATH} must be unique'});

userSchema.methods.toJSON = function() {
    var obj = this.toObject()
    delete obj.password;
    delete obj.providerId
    return obj;
};

userSchema.pre('save', function (next) {
    var user = this;
   
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.statics.localStrategy = new LocalStrategy({ usernameField: 'email', passwordField: 'password' },
    function(email, password, done) {
        var pwd = password;
        var repository = require('../repositories/user_repository');
        
        repository.findOne({'email': email}, null, null, function (err, user) {
            if (!user) {
                done(null, false, {message: 'Tentative de connection échouée'});
            }
            else {
                service.comparePassword(user.password, pwd, function (err, isMatch) {
                    if (err || isMatch === false) {
                        done(null, false, {message: 'Tentative de connection échouée'});
                    }
                    else {
                        done(null, user);
                    }
                })
            }
        });
    }
);

userSchema.statics.twitterStrategy = function() {
    var repository= require('../repositories/user_repository');
    
    return new TwitterStrategy({
        consumerKey: constants.STRATEGY.twitter.consumerKey,
        consumerSecret: constants.STRATEGY.twitter.consumerSecret,
        callbackURL: constants.STRATEGY.twitter.callbackURL
    },
    function(token, tokenSecret, profile, done) {
        repository.findOrCreateOauthUser('twitter', profile.id, profile, function (err, user) {
           done(null, user); 
        });
    });
};

userSchema.statics.facebookStrategy = function() {
    var repository= require('../repositories/user_repository');
    
    return new FacebookStrategy({
        clientID: constants.STRATEGY.facebook.clientId,
        clientSecret: constants.STRATEGY.facebook.clientSecret,
        callbackURL: constants.STRATEGY.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        repository.findOrCreateOauthUser('facebook', profile.id, profile, function (err, user) {
           done(null, user); 
        });
    });
};

userSchema.statics.googleStrategy = function() {
    var repository= require('../repositories/user_repository');
    
    return new GoogleStrategy({
        returnURL: constants.STRATEGY.google.returnURL,
        realm: constants.STRATEGY.google.realm,
        stateless: constants.STRATEGY.google.stateless
    },
    function(identifier, profile, done) {
        repository.findOrCreateOauthUser('google', identifier, profile, function (err, user) {
           done(null, user); 
        });
    });
};

userSchema.statics.linkedInStrategy = function() {
    var repository= require('../repositories/user_repository');
    
    return new LinkedInStrategy({
        consumerKey: constants.STRATEGY.linkedin.consumerKey,
        consumerSecret: constants.STRATEGY.linkedin.consumerSecret,
        callbackURL: constants.STRATEGY.linkedin.callbackURL
    },
        function(token, tokenSecret, profile, done) {
            repository.findOrCreateOauthUser('linkedin', profile.id, profile, function (err, user) {
               done(null, user); 
            });
        }
    );
};
    
userSchema.statics.serializeUser = function(user, done) {
    done(null, user.id);
};

userSchema.statics.deserializeUser = function(id, done) {
    mongoose.model('User').findById(id, function (err, user) {
        if (!user) done(null, false);
        else done(null, user);
    });
};

module.exports = function () {
    mongoose.model('User', userSchema);  
};