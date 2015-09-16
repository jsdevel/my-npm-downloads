import APP from './app.module.js';

APP.factory('storageService', function() {
  let store = localStorage;

  return {
    clear(regex) {
      var keys = Object.keys(store);

      if (regex instanceof RegExp) {
        keys = keys.filter((key) => regex.test(key));
      }

      keys.forEach((key) => {
        delete store[key];
      });
    },

    get(key) {
      return angular.fromJson(store[key]);
    },

    set(key, val) {
      store[key] = angular.toJson(val);
    }
  };
});
