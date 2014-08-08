'use strict';

angular.module("angular-client-side-auth").service('notif', ['toastr', '$rootScope', function(toastr, $rootScope) {
    var logIt;
    var options = {
        regular: {
          "allowHtml": true,
          "positionClass": "toast-top-right",
          "timeOut": "100000",
          "extendedTimeOut": "10000"
        },
        wait: {
          "allowHtml": true,
          "positionClass": "toast-top-right",
          "timeOut": "100000",
          "extendedTimeOut": "10000"
        }
    }
    logIt = function(message, title, type) {
        if (type == 'wait') {
            toastr.options = options.wait;
            $('#modal_overlay').show();
        }
        else {
            toastr.options = options.regular;
        }
        
        return toastr[type](message, title, toastr.options);
    };
    return {
      log: function(message, title) {
        return logIt(message, title, 'info');
      },
      warning: function(message, title) {
        return logIt(message, title, 'warning');
      },
      success: function(message, title) {
        return logIt(message, title, 'success');
      },
      error: function(message, title) {
        return logIt(message, title, 'error');
      },
      wait: function (message, title) {
          var toast = logIt(message, title, 'wait');
          $rootScope.waitToast = toast;
          return toast;
        
      },
      clear: function (toast) {
        if (toast != null) {
            if (toast.scope.toastType == 'toast-wait') {
                $('#modal_overlay').hide();
            }
            
           toastr.clear(toast);
        }  
      },
      showAll: function () {
          if (toasts != null) {
              
          }
      }
    };
  }
]);
