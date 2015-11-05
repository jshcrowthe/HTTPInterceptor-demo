angular
.module('app', ['retryModule', 'requestLoggerModule', 'authModule'])
.factory('timeoutHandler', ['$q', function($q) {
  return {
    requestError: function(err) {
      console.log(err);
      return $q.reject(err);
    },
    responseError: function(res) {
      console.log(res);
      return $q.reject(res);
    }
  }
}])
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('timeoutHandler');
}])
.service('apiService', ['$http', function($http) {
  this.reliableRequest = function(mountPoint) {
    return $http({
      method: 'GET',
      url: mountPoint + '/reliable',
    });
  }

  this.unreliableRequest = function(mountPoint) {
    return $http({
      method: 'GET',
      url: mountPoint + '/unreliable'
    });
  }
}])
.controller('ctrl', ['$scope', 'authService', 'apiService',  function($scope, $auth, $api) {
  $scope.secure = false;
  $scope.reset = function() {
    $scope.response = null;
    $scope.error = null;
  };
  $scope.toggleSecure = function() {
    return ($scope.secure = !$scope.secure);
  };
  $scope.makeValidRequest = function() {
    $scope.reset();
    var mountPoint = $scope.secure ? '/secure_api' : '/open_api';
    $api.reliableRequest(mountPoint)
    .then(function(data) {
      $scope.response = data;
    }, function(err) {
      $scope.error = err.data;
    })
  };

  $scope.makeBadRequest = function() {
    $scope.reset();
    var mountPoint = $scope.secure ? '/secure_api' : '/open_api';
    $api.unreliableRequest(mountPoint)
    .then(function(data) {
      $scope.response = data;
    }, function(err) {
      $scope.error = err.data;
    });
  };

  $scope.login = function() {
    $auth.login();
  };
}]);