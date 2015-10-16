import APP from './app.module.js';

APP.directive('packages', function($http, packageService, storageService) {
  return {
    template: `
      <div>
        <ol ng-if="vm.packages">
          <li ng-repeat="package in vm.packages | orderBy:'downloads':true">
            <a href="" ng-click="vm.openTab(package.name)">{{package.name}}</a> - {{package.downloads}}
          </li>
        </ol>
        <div ng-if="!vm.packages">
        Loading...
        </div>
      </div>
      `,
    controllerAs: 'vm',
    bindToController: true,
    replace: true,
    scope: {
      username: '='
    },
    controller($scope, $http) {
      var vm = this;

      vm.openTab = packageService.openInChromeTab;

      $scope.$watch(() => this.username, (username) => {
        if (username) {
          let date = new Date();
          let day = date.getDate();
          let month = date.getMonth();
          let cacheKey = `${month} - ${day} - ${username}`;

          if (storageService.get(cacheKey)) {
            vm.packages = angular.fromJson(storageService.get(cacheKey));
            vm.username = username;
          } else {
            storageService.clear(/^[0-9]+ - [0-9]+ -.+$/);
            vm.packages = null;

            packageService.getPackageStatsForUser(username)
              .then((packages) => {
                vm.packages = packages;
                vm.username = username;
                storageService.set(cacheKey, angular.toJson(packages));
              });
          }
        }
      });
    }
  };
});
