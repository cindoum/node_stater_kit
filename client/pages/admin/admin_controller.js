angular.module('angular-client-side-auth') .controller('AdminCtrl', ['$rootScope', '$scope', 'users', 'Auth', function($rootScope, $scope, users, Auth) {
    var _init = function () {
        $scope.userRoles = Auth.userRoles;
        $scope.users = users;
    }
    
    _init();
}]);

