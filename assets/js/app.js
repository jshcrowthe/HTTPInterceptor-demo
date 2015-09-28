angular
.module('app', ['retryModule', 'requestLoggerModule', 'authModule'])
.controller('ctrl', ['$scope', '$http', '$q', 'authService', function($scope, $http, $q, $auth) {
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
    $http({
      method: 'GET',
      url: mountPoint + '/reliable'
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
    var mountPoint = $scope.secure ? '/secure_api/' : '/open_api/';
    $http({
      method: 'GET',
      url: mountPoint + '/unreliable'
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