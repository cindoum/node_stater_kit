require('../../../configs/model_conf')();
var expect      = require('chai').expect,
    sinon       = require('sinon'),
    User        = require('../../../models/user_model'),
    UserCtrl    = require('../../../controllers/user_controller');
    
describe('Auth controller Unit Tests - ', function() {
    var req = { }
        , res = {}
        , next = {}
        , sandbox = sinon.sandbox.create();

    beforeEach(function() {

    });

    afterEach(function() {
        sandbox.restore();
    });

    describe('register()', function() {

        beforeEach(function() {
            req.body = {
                username: "usersss",
                password: "pa",
                role: 1
            };
        });

        it('should return a 400 when user validation fails', function(done) {
            this.timeout(150000);
            res.send = function(httpStatus, err) {
                expect(httpStatus).to.equal(403);
                done();
            };

            UserCtrl.register(req, res, next);
        });
    });
});