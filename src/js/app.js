const APP = angular.module('myApp', []);
const STORAGE = localStorage;
const PACKAGES_REGEX = /<ul\s+class="[^"]*collaborated-packages">((?:(?!<\/ul>)[\s\S])+)<\/ul>/gm;
const NPM = 'https://www.npmjs.com';

APP.directive('user', () => {
  return {
    template: `
      <div>
        <label>npm username</label>
        <div class="row">
          <input ng-model="vm.username"/>
          <button ng-click="vm.updateStorage()">Update</button>
        </div>
      </div>
      `,

    controllerAs: 'vm',
    bindToController: true,
    replace: true,
    scope: {},
    controller($rootScope) {
      this.username = STORAGE.username;
      this.updateStorage = () => {
        STORAGE.username = this.username;
      };
    }
  };
});

APP.directive('packages', ($http) => {
  return {
    template: `
      <div>
        <ol ng-if="vm.username">
          <li ng-repeat="package in vm.packages | orderBy:'monthlyDownloads':true">
            {{package.title}} - {{package.monthlyDownloads}}
          </li>
        </ol>
        <div ng-if="!vm.username">
        Please enter a username.
        </div>
      </div>
      `,
    controllerAs: 'vm',
    bindToController: true,
    replace: true,
    scope: {},
    controller($scope, $http) {
      $scope.$watch(() => STORAGE.username, (username) => {
        this.username = username;

        if (username) {
          let date = new Date();
          let day = date.getDate();
          let month = date.getMonth();
          let cacheKey = `${month} - {day} - ${username}`;

          if (STORAGE[cacheKey]) {
            this.packages = JSON.parse(STORAGE[cacheKey]);
          } else {
            $http.get(`${NPM}/~${username}`)
              .then((response) => {
                let data = response.data;
                let items = PACKAGES_REGEX.exec(data)[1];
                let list = document.createElement('ul');
                list.innerHTML = items;
                this.packages = [].slice.call(list.children).map((item) => {
                  let pkg = {
                    title: item.childNodes[1].textContent.trim(),
                    url: item.childNodes[1].attributes.href.value,
                    version: item.childNodes[3].textContent.trim(),
                    description: item.childNodes[4].textContent.trim().replace(/^-\s+/m, ''),
                    dailyDownloads: null,
                    weeklyDownloads: null,
                    monthlyDownloads: null
                  };

                  $http.get(`${NPM}${pkg.url}`).then((response) => {
                    let pkgPage = response.data;
                    pkg.dailyDownloads = new Number(pkgPage
                        .replace(/^[\s\S]+daily-downloads[^"]*">([0-9,]+)[\s\S]+$/m, '$1'));
                    pkg.weeklyDownloads = new Number(pkgPage
                        .replace(/^[\s\S]+weekly-downloads[^"]*">([0-9,]+)[\s\S]+$/m, '$1'));
                    pkg.monthlyDownloads = new Number(pkgPage
                        .replace(/^[\s\S]+monthly-downloads[^"]*">([0-9,]+)[\s\S]+$/m, '$1'));
                    STORAGE[cacheKey] = JSON.stringify(this.packages);
                  });

                  return pkg;
                });
              });
          }
        }
      });
    }
  };
});
