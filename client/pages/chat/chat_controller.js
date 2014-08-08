angular.module('angular-client-side-auth') .controller('ChatCtrl', ['$scope', 'socket', function($scope, socket) {
    var _init = function () {
        $scope.sendText = function () {
            socket.emit('chat:newText', { text: $scope.text});
        };
        
        socket.on('chat:newText', function (data) {
             $('#chatContainer').append('<div class="alert alert-success"><strong>' + data.username + '</strong> : ' + data.text + '</div>');
        });
    }
    
    _init();
}]);

