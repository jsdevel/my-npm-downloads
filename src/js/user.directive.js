import APP from './app.module.js';

APP.directive('user', function(storageService) {
  return {
    template: `
      <div>
        <label>npm username</label>
        <div class="row">
          <input ng-model="vm.pendingUsername"/>
          <button ng-click="vm.updateUsername()">Update</button>
        </div>
      </div>
      `,

    controllerAs: 'vm',
    bindToController: true,
    replace: true,

    scope: {
      username: '='
    },

    controller() {
      if (this.username) {
        this.pendingUsername = this.username;
      }

      this.updateUsername = () => {
        this.username = this.pendingUsername;
        storageService.set('username', this.username);
      };
    }
  };
});
