myApp.controller('DashboardController', [ '$http', 'MatchupService', function ($http, MatchupService) {
    console.log('SportsController started.');
    var vm = this;
    vm.populateDB = MatchupService.populateDB;



}]);