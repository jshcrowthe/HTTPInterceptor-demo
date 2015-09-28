angular
.module('app', ['retryModule', 'requestLoggerModule', 'authModule'])
.controller('ctrl', ['$scope', '$http', '$q', 'authService', function($scope, $http, $q, $auth) {
  $scope.reset = function() {
    $scope.response = null;
    $scope.error = null;
  };
  $scope.makeValidRequest = function() {
    $scope.reset();
    $http({
      method: 'GET',
      url: '/api/reliable'
    })
    .success(function(data) {
      $scope.response = data;
    })
    .error(function(err) {
      $scope.error = err;
    });
  };

  $scope.makeBadRequest = function() {
    $scope.reset();
    $http({
      method: 'GET',
      url: '/api/unreliable'
    })
    .success(function(data) {
      $scope.response = data;
    })
    .error(function(err) {
      $scope.error = err;
    });
  };

  $scope.login = function() {
    $auth.login();
  };
}]);