myApp.controller('PicksController', ['UserService', 'PickService', function(UserService, PickService) {
    console.log('PicksController created');
    var vm = this;
    vm.getWeekMatchups = PickService.getWeekMatchups;
    vm.selectedWeek = PickService.selectedWeek;
    vm.dbMatchupData = PickService.dbMatchupData;



    
    
  }]);