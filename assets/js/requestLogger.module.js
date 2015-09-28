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
.factory('loggingInterceptor', [function() {
  return {
    // Logging Interceptor
  }
}])
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('loggingInterceptor');
}])