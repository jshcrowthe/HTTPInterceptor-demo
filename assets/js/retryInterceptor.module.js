angular.module('retryModule', [])
.factory('retryInterceptor', [function() {
  return {
    // Retry Interceptor!
  }
}])
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('retryInterceptor');
}])