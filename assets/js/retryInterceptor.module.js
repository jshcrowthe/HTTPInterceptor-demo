angular.module('retryModule', [])
.factory('retryInterceptor', ['$q', '$injector', function($q, $injector) {
  return {
    responseError: function(res) {
      if (res.status !== 503) return $q.reject(res);
      if (res.config.retry) {
        res.config.retry++;
      } else {
        res.config.retry = 1;
      }
      if (res.config.retry > 9) return $q.reject(res);
      return $injector.get('$http')(res.config);
    }
  }
}])
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('retryInterceptor');
}])