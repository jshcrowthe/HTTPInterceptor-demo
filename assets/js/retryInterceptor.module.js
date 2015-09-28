angular.module('retryModule', [])
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
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('retryInterceptor');
}])