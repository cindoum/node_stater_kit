'use strict';

angular.module('angular-client-side-auth').factory('socket', function ($rootScope, Auth) {
    var socket;
    
    var validateConnection = function () {
        if (Auth.isLoggedIn() === true) {
            if (socket != null && socket.socket != null) {
                socket.socket.reconnect();
            }
            else {
                socket = io.connect('https://playground-c9-doum.c9.io');
            }
        }
    };
  
    return {
        on: function (eventName, callback) {
            validateConnection();
            
            var listeners = socket.listeners(eventName);
            if (listeners != null && listeners.length < 1) {
                socket.on(eventName, function () {  
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback != null && angular.isFunction(callback) === true) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        },
        emit: function (eventName, data, callback) {
            validateConnection();
            
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback != null && angular.isFunction(callback) === true) {
                        callback.apply(socket, args);
                    }
                });
            })
        },
        disconnect: function () {
            if (socket != null) {
                socket.disconnect();
            }
        },
    };
});