var mongoose =   require('mongoose');
var _user =      mongoose.model('User'),
    service = 	 require('../services/user_service'),
	_ = 		 require('lodash-node');

var _findByProviderId = function (provider, id, next) {
	_user.findOne({provider: provider, providerId: id}, next);
};
	

module.exports = {
	findAll: function (next) {
		_user.find({}, next);
	},
	findOne: function (condition, fields, options, next) {
		mongoose.model('User').findOne(condition, fields, options, next);
	},
	findOrCreateOauthUser: function (provider, providerId, profile, next) {
		_findByProviderId(provider, providerId, function (err, user) {
	        if(_.isNull(user)) {
	            service.generateUser(provider, profile, providerId, next);
	        }
	        else {
	            next(err, user);
	        }
	    });
	},
	addUser: function(user, next) {
	    service.generateUser('local', user, null, next);
	},
	retrievePassword: function (user, next) {
	    mongoose.model('User').findOne({email: user.email}, function (err, user) {
	        if (err) return next(err); 
	        if (user) {
	            user.password = '11111';
	            user.save(function (err) {
	                if (err) return next(err);
	                require('../configs/nodemailer_conf').sendMail(user.email, 'Nouveau mot de passe', 'Votre nouveau mot de passe : <strong>111111</strong>');
	                next(err);
	            })
	        }
	    });
	}
};