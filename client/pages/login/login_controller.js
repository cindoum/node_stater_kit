angular.module('angular-client-side-auth')
.controller('LoginCtrl',
['$rootScope', '$scope', '$location', '$window', 'Auth', 'socket', '$modal', 'notif', function($rootScope, $scope, $location, $window, Auth, socket, $modal, notif) {
    var _init = function () {
        $scope.user = { retrievePassword: {}, rememberme: true};
    };
    
    $scope.login = function() {
        Auth.login({
                email: $scope.user.email,
                password: $scope.user.password,
                rememberme: $scope.user.rememberme
            },
            function(res) {
                $location.path('/');
            },
            function(err) {
                notif.error(err, 'Oups!');
            });
    };
    
    $scope.retrievePassword = function () {
        $modal.open({
           scope: $scope,
           backdrop: 'static',
           templateUrl: 'retrievepopup'
        }).result.then(function () {
            Auth.retrievePassword($scope.user.retrievePassword.email, function () {
                notif.success('Votre nouveau mot de passe a été envoyé par couriel', 'Mot de passe changé');
            });
        }, function (reason) {
            // dismiss => nothing to do
        }).finally(function () {
            $scope.user.retrievePassword = '';
        });
    }

    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
    
    _init();
}]);