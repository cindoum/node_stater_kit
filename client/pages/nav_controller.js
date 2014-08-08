angular.module('angular-client-side-auth')
.controller('NavCtrl', ['$rootScope', '$scope', '$location', 'Auth', 'socket', 'notif', function($rootScope, $scope, $location, Auth, socket, notif) {
    var _init = function () {
        $scope.user = Auth.user;
        $scope.userRoles = Auth.userRoles;
        $scope.accessLevels = Auth.accessLevels;  
    };

    $scope.logout = function() {
        Auth.logout(function() {
            socket.disconnect();
            $location.path('/login');
        }, function() {
            notif.warning('La tentative de déconnexion à échoué.', 'Ouop!');
        });
    };
    
    _init();
}]);