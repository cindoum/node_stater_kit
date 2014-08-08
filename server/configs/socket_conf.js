var socket =            require('socket.io'),
    passportSocketIo =  require('passport.socketio'),
    constant =          require('./constants.js');
    
module.exports = function (server, db, express ) {
    var io = socket.listen(server);
    var store = require('connect-mongo')(express);
    
    io.set('authorization', passportSocketIo.authorize({
        passport: require('passport'),
        cookieParser: express.cookieParser,
        key:         'connect.sid',       // the name of the cookie where express/connect stores its session_id
        secret:      constant.SALT,    // the session_secret to parse the cookie
        store:       new store({
            mongoose_connection: db,
            collection: constant.SESSION_COLLECTION,
        }),
    }));
    
    io.sockets.on('connection', function (socket) {
        socket.on('chat:newText', function (data) {
            data.username = socket.handshake.user.username;
            io.sockets.emit('chat:newText', data);
        });
    });
};