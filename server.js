var express =               require('express')
    , http =                require('http')
    , passport =            require('passport')
    , mongoose =            require('mongoose')
    , constant =            require('./server/configs/constants.js');
    
mongoose.connect(constant.MONGOHQ_CONN_STRING);
mongoose.set('debug', true);

var db = mongoose.connection;
db.setProfiling(2, 25, function (err, doc) {
    console.log('PROFILING : %j', err);
    console.log('PROFILING : %j', doc)
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log('---------------------------------------------------------------- : ' + process.env);
    console.log("Connected to mongoHQ database");
    
    var app = module.exports = express();
    
    require('./server/configs/model_conf.js')();
    
    var logger = require('./server/configs/winston_conf.js')();
    var passport = require('./server/configs/passport_conf.js')(app, db, express);
    require('./server/configs/express_conf.js')(app, express, __dirname, db, passport, logger);
    require('./server/routes/routes.js')(app);
    
    var server = http.createServer(app).listen(app.get('port'), function(){
        console.log("Express server listening on port " + app.get('port'));
    });
    
    require('./server/configs/socket_conf.js')(server, db, express);
});