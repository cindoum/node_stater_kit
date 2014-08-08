var mongoose =            require('mongoose')
    , constant =          require('../configs/constants.js')
    , bcrypt =            require('bcrypt')
    , userRoles =         require('../../client/js/routingConfig').userRoles;
    
mongoose.connect(constant.MONGOHQ_CONN_STRING);
mongoose.set('debug', true);
var db = mongoose.connection;
require('../configs/model_conf.js')();

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    _removeAllUser();
    _poppulateUsers();
    
});

function _removeAllUser() {
    var userModel = mongoose.model('User');
    
    userModel.remove({});
};

function _poppulateUsers() {
    var userModel = mongoose.model('User');
    
    userModel.create({
        username: 'Doum',
        firstname: 'Dominic',
        lastname: 'Laspointe',
        email: 'dom.dlapointe@gmail.com',
        password: '12345',
        role: userRoles.admin
    });
    
    userModel.create({
        username: 'user',
        firstname: 'anonymous',
        lastname: 'user',
        email: 'anon@gmail.com',
        password: '12345',
        role: userRoles.user
    })
};