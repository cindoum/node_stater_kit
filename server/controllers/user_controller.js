var _ =             require('lodash-node'), 
    passport =      require('passport'),
    service =       require('../services/user_service'),
    errorService =  require('../services/error_service'),
    repository = require('../repositories/user_repository');

module.exports = {
    index: function(req, res) {
        repository.findAll(function (err, users) {
            res.json(users);
        });
    },
    register: function(req, res, next) {
        try {
            service.validateUser(req.body);
        }
        catch(err) {
            return res.send(403, err.message);
        }
        
        repository.addUser(req.body, function(err, user) {
            if (err) return res.send(403, errorService.format(err)); 
            
            req.logIn(user, function(err) {
                if(err)     { next(errorService.format(err)); }
                else        { res.json(200, { "role": user.role, "username": user.username }); }
            });
        });
    },

    login: function(req, res, next) {
        passport.authenticate('local', function(err, user) {
            if(err)     { return next(errorService.format(err)); }
            if(!user)   { return res.send(403, 'Connection attempt failed'); }

            req.logIn(user, function(err) {
                if(err) return next(errorService.format(err));
                

                if(req.body.rememberme) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
                res.json(200, { "role": user.role, "username": user.username });
            });
        })(req, res, next);
    },

    logout: function(req, res) {
        req.logout();
        res.send(200);
    },
    retrievePassword: function (req, res) {
        repository.retrievePassword(req.body, function (err) {
            if (err) return res.send(403, errorService.format(err));
            return res.json(200);
        });
    }
};