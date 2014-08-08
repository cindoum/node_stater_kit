var _userRoles = require('../../client/js/routingConfig').userRoles,
	check =      require('validator').check,
	bcrypt =     require('bcrypt'),
	mongoose =   require('mongoose');

var _generateUserFromGoogleProvider = function (profile, id) {
	return { userName: profile.displayName, firstName: profile.name.givenName, lastName: profile.name.familyName, email: _.first(profile.emails), provider: 'google', id: id };
};

var _generateUserFromFacebookProvider = function (profile, id) {
	return { userName: profile.displayName, firstName: profile.name.givenName, lastName: profile.name.familyName, email: _.first(profile.emails), provider: 'facebook', id: id };
};

var _generateLocalUser = function (profile, id) {
	return { userName: profile.username, firstName: profile.username, lastName: profile.username, email: profile.email, password: profile.password };
};

module.exports = {
	generateUser: function (provider, profile, id, next) {
		var user = null;
		
		switch (provider.toLowerCase()) {
			case 'google' :
				user = _generateUserFromGoogleProvider(profile, id);
				break;
			case 'twitter' :
				// unsupported yet
				break;
			case 'facebook' :
				user = _generateUserFromFacebookProvider(profile, id);
				break;
			case 'linkedin' :
				
				break;
			default :
				user = _generateLocalUser(profile, id);
				break;
		}
		
		if (user !== null) {
			mongoose.model('User').create({
				password:   user.password,
			    username:   user.userName,
			    firstname:  user.firstName,
			    lastname:   user.lastName,
			    email:      user.email,
			    role:       _userRoles.user,
			    provider:   user.provider,
			    providerId: user.id,
			}, next);
		}
		else {
			next(new Error('This authentification method is not supported yet.'));
		}
	},
	validateUser:  function(user) {
	    var test = check(user.email, 'Email not valid').isEmail();
	    test += check(user.username, 'Username length must be between 3 and 20').len(3, 20);
	    test += check(user.password, 'Password length must be between 5 and 30').len(5, 60);
	    test += check(user.username, 'Username not valid').not(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);

		return test;
	},
	isUsernameUnique: function(username, next) {
	    mongoose.model('User').count({'username': username}, function (err, count) {
	        next(err, count < 1);
	    });
	},
	comparePassword: function(userPassword, testPassword, next) {
	    bcrypt.compare(testPassword, userPassword, function(err, isMatch) {
	        if (err) return next(err);
	        next(null, isMatch);
	    });
	}
};