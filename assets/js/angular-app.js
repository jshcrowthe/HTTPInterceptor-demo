var log = function(status, config, endTime) {
  return config.method.toUpperCase() + ' ' +
                      config.url + ' ' + (config.retry ? '(Retry: ' + config.retry +') ': '') +
                      status + ' ' + 
                      (endTime-config.startTime) + 'ms' ;
};

angular
.module('app', [])
.factory('retryInterceptor', function($q, $injector) {
  return {
    responseError: function(res) {
      if (res.status !== 503) return $q.reject(res);
      if (res.config.retry) {
        res.config.retry++;
      } else {
        res.config.retry = 1;
      }

      if (res.config.retry < 10) {
        return $injector.get('$http')(res.config);
      }
      return $q.reject(res);
    }
  };
})
.service('requestLoggerService', function() {
  this.requestLogs = [];
})
.directive('requestLogger', ['requestLoggerService', function(service) {
  return {
    restrict: 'E',
    scope: {},
    link: function(scope) {
      scope.hasLogs = function() {
        return !service.requestLogs.length;
      };
      scope.getRequestLog = function() {
        return service.requestLogs;
      };
    },
    template: '<div class="request-box alert alert-info" ng-hide="hasLogs()"><ul><li ng-repeat="log in getRequestLog() track by $index">{{log}}</li></ul></div>'
  };
}])
.factory('loggingInterceptor', ['$q', 'requestLoggerService', function($q, logService) {
  return {
    request : function(config) {
      config.startTime = new Date().getTime();
      return config;
    },
    response: function(res) {
      var end = new Date().getTime();
      logService.requestLogs.unshift(log(res.status, res.config, end));
      return res;
    },
    responseError: function(res) {
      var end = new Date().getTime();
      logService.requestLogs.unshift(log(res.status, res.config, end));
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