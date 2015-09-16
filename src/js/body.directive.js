import APP from './app.module.js';

APP.directive('body', function(storageService) {
  return {
    bindToController: true,
    controllerAs: 'app',
    controller($scope) {
      var app = this;

      app.username = storageService.get('username');
    }
  };
});
