myApp.controller('PicksController', ['UserService', 'PickService', function (UserService, PickService) {
  console.log('PicksController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.getWeekMatchups = PickService.getWeekMatchups;
  vm.selectedWeek = PickService.selectedWeek;
  vm.dbMatchupData = PickService.dbMatchupData;
  vm.dbWeekMatchupData = PickService.dbWeekMatchupData;
  vm.newPick = PickService.newPick;
  vm.postPick = PickService.postPick;





  

}]);