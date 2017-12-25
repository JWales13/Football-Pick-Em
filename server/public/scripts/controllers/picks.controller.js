myApp.controller('PicksController', ['UserService', 'PickService', function(UserService, PickService) {
    console.log('PicksController created');
    var vm = this;
    vm.getWeekMatchups = PickService.getWeekMatchups;
    vm.selectedWeek = PickService.selectedWeek;
    vm.dbMatchupData = PickService.dbMatchupData;
    vm.dbWeekMatchupData = PickService.dbWeekMatchupData;
    vm.getAllMatchupData = PickService.getAllMatchupData;
    vm.newPick = PickService.newPick;
    vm.postPicks = PickService.postPicks;
    



    vm.getAllMatchupData();
    
  }]);