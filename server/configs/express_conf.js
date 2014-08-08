var constant =    require('./constants.js'),
    path =        require('path'),
    mongoose =    require('mongoose'),
    mongoStore =  require('connect-mongo');
    
module.exports = function(app, express, dirname, db, passport, logger) {
    var store = mongoStore(express);
    
    app.set('views', path.join(dirname, constant.VIEWS_DIR));
    app.set('view engine', 'jade');
    
    app.use(express.logger('dev'))
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(path.join(dirname, 'client')));
    app.use(express.cookieParser());
    app.use(express.session({
        secret: constant.SALT,
        store: new store({
          mongoose_connection: db,
          collection: constant.SESSION_COLLECTION,
        })
    }));
    app.configure('development', 'production', function() {
        app.use(express.csrf());
        app.use(function(req, res, next) {
            res.cookie('XSRF-TOKEN', req.csrfToken());
            next();
        });
    });
    app.use(passport.initialize());
    app.use(passport.session({
        secret: constant.SALT,
        store: new store({
            mongoose_connection: db,
            collection: constant.SESSION_COLLECTION,
        })
    }));
    
    app.use(app.router);

    app.set('port', process.env.PORT || constant.DEFAULT_PORT);
    
    return app;
};