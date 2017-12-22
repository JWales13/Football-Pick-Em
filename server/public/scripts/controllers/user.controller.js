myApp.controller('UserController',['UserService','MatchupService', function(UserService, MatchupService) {
    console.log('UserController created');
    var vm = this;
    vm.userService = UserService;
    vm.userObject = UserService.userObject;
    vm.populateDB = MatchupService.populateDB;
  }]);