import APP from './app.module.js';

const NPM = 'https://www.npmjs.com';
const NPM_ORG = 'https://api.npmjs.org';

APP.factory('packageService', function($http, $q) {
  return {
    getPackageStatsForUser: function getPackageStatsForUser(username, period = 'last-month') {
      return getPackages(username).then((packages) => {
        return $q.all(packages.map(getPackageStats.bind(null, period))).then((stats) => {
          stats.forEach((stat, i) => {
            packages[i].downloads = stat;
          });

          return packages;
        });
      });
    },

    openInChromeTab: function openInChromeTab(packageName) {
      chrome.tabs.create({url: `${NPM}/package/${packageName}`});
    }
  };

  function getPackageStats(period, pkg) {
    return $http.get(`${NPM_ORG}/downloads/point/${period}/${pkg.name}`)
        .then((response) => response.data.downloads);
  }

  function getPackages(username, offset = 0, packages = []) {
    return $http.get(`${NPM}/profile/${username}/packages?offset=${offset}`)
      .then((response) => {
        response = response.data;
        [].push.apply(packages, response.items);

        if (response.hasMore) {
          return getPackages(username, offset + 1, packages);
        } else {
          return packages;
        }
      });
  }
});
