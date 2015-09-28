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
.factory('reAuthInterceptor', ['authService', function(service) {
  return {
    // ReAuthentication Interceptor
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