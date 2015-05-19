angular
.module('app', [])
.factory('retryInterceptor', function($q, $injector) {
  return {
    responseError: function(rejection) {
      if (rejection.config.retry) {
        rejection.config.retry++;
      } else {
        rejection.config.retry = 1;
      }

      if (rejection.config.retry < 5) {
        return $injector.get('$http')(rejection.config);
      } else {
        return $q.reject(rejection);
      }
    }
  };
})
.factory('authInterceptor', function() {
  return {
    request : function(config) {
      config.headers.authorization = 'Bearer my-super-secret-auth-token';
      return config;
    }
  };
})
.config(function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
  $httpProvider.interceptors.push('retryInterceptor');
})
.controller('ctrl', function($scope, $http, $q) {
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

  $scope.makeAuthRequiredRequest = function() {
    $scope.reset();
    $http({
      method: 'GET',
      url: '/api/authRequired'
    })
    .success(function(data) {
      $scope.response = data;
    })
    .error(function(err) {
      $scope.error = err;
    });
  };


});