angular.module('angular-client-side-auth')
.controller('RegisterCtrl',
['$rootScope', '$scope', '$location', 'Auth', 'notif', 'localize', function($rootScope, $scope, $location, Auth, notif, localize) {
    var _init = function () {
        $scope.role = Auth.userRoles.user;
        $scope.userRoles = Auth.userRoles;
        $scope.user = {};
    };

    $scope.register = function() {
        Auth.register({
                email: $scope.user.email,
                username: $scope.user.username,
                password: $scope.user.password
            },
            function() {
                $location.path('/');
            },
            function(err) {
                notif.error(err, localize.getLocalizedString("errtitle"));
            });
    };
    
    _init();
}]);