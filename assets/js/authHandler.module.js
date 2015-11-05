angular.module('authModule', [])
.service('authService', ['$injector', function($injector) {
  var loginToken = null;
  this.login = function() {
    return $injector.get('$http')({
      method: 'GET',
      url: '/login'
    }).then(function(res) {
      loginToken = res.data.key;
    });
  };

  this.getAuthToken = function() {
    return loginToken;
  };
}])
.factory('reAuthInterceptor', ['authService', '$q', '$injector', function(service, $q, $injector) {
  return {
    responseError: function(res) {
      if (res.status !== 401) return $q.reject(res);
      // handle the 401

      var dfd = $q.defer();

      service.login().then(function() {
        return dfd.resolve($injector.get('$http')(res.config));
      }, dfd.reject).catch(dfd.reject);

      return dfd.promise;
    }
  }
}])
.factory('authInterceptor', ['authService', function(service) {
  return {
    request : function(config) {
      config.headers.authorization = service.getAuthToken();
      return config;
    }
  };
}])
.config(function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
  $httpProvider.interceptors.push('reAuthInterceptor');
})