var log = function(status, config, endTime) {
  return config.method.toUpperCase() + ' ' +
                      config.url + ' ' + (config.retry ? '(Retry: ' + config.retry +') ': '') +
                      status + ' ' + 
                      (endTime-config.startTime) + 'ms' ;
};

angular
.module('app', [])
.factory('retryInterceptor', ['$q', '$injector', function($q, $injector) {
  return {
    responseError: function(res) {
      if (res.status !== 503) return $q.reject(res);
      if (!res.config.retry || res.config.retry < 3) {
        res.config.retry = res.config.retry ? (res.config.retry + 1) : 1;
        // Manually inject $http (if we try to do it above
        // angular will throw a circular dependency error)
        return $injector.get('$http')(res.config);
      } 
      return $q.reject(res);
    }
  };
}])
.service('requestLoggerService', function() {
  this.requests = [];
})
.directive('requestLogger', ['requestLoggerService', function(service) {
  return {
    restrict: 'E',
    scope: {},
    link: function(scope) {
      scope.hasLogs = function() {
        return !service.requests.length;
      };
      scope.getRequestLog = function() {
        return service.requests;
      };
    },
    template: '<div class="request-box alert alert-info" ng-hide="hasLogs()"><ul><li ng-repeat="log in getRequestLog() track by $index">{{log}}</li></ul></div>'
  };
}])
.factory('loggingInterceptor', ['$q', 'requestLoggerService', function($q, service) {
  return {
    request: function(config) {
      config.startTime = new Date().getTime();
      return config;
    },
    response: function(res) {
      var endTime = new Date().getTime();
      service.requests.push(res.config.method.toUpperCase() + ' ' 
                            + res.status + ' '
                            + res.config.url + ' '
                            + '- ' + (endTime - res.config.startTime) + 'ms');
      return res;
    },
    responseError: function(res) {
      var endTime = new Date().getTime();
      service.requests.push(res.config.method.toUpperCase() + ' ' 
                            + res.status + ' '
                            + res.config.url + ' '
                            + '- ' + (endTime - res.config.startTime) + 'ms');
      return $q.reject(res);
    }
  };
}])
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
  $httpProvider.interceptors.push('loggingInterceptor');
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