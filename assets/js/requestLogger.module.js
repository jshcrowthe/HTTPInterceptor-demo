angular.module('requestLoggerModule', [])
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
      service.requests.unshift(res.config.method.toUpperCase() + ' ' 
                            + res.status + ' '
                            + res.config.url + ' '
                            + '- ' + (endTime - res.config.startTime) + 'ms');
      return res;
    },
    responseError: function(res) {
      var endTime = new Date().getTime();
      service.requests.unshift(res.config.method.toUpperCase() + ' ' 
                            + res.status + ' '
                            + res.config.url + ' '
                            + '- ' + (endTime - res.config.startTime) + 'ms');
      return $q.reject(res);
    }
  };
}])
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('loggingInterceptor');
}])











