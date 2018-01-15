myApp.controller('UserController', ['UserService', 'MatchupService', function (UserService, MatchupService) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.populateDB = MatchupService.populateDB;
  vm.getWeekMatchups = MatchupService.getWeekMatchups;
  vm.selectedWeek = MatchupService.selectedWeek;
  vm.dbWeekMatchupData = MatchupService.dbWeekMatchupData;
  vm.addSpread = MatchupService.addSpread;
  vm.newSpread = MatchupService.newSpread;
  vm.calcWeekWinners = MatchupService.calcWeekWinners;
  vm.addUpPoints = MatchupService.addUpPoints;
  vm.getUserPicks = MatchupService.getUserPicks;
  vm.seasonStandings = MatchupService.seasonStandings;
  vm.userPickData = MatchupService.userPickData;
  vm.players = MatchupService.players;
  vm.getWeekMatchupsPicks = MatchupService.getWeekMatchupsPicks;
  vm.getUsers = MatchupService.getUsers;
  vm.deleteUser = MatchupService.deleteUser;
  vm.usersData = MatchupService.usersData;
  vm.getWeekStandings = MatchupService.getWeekStandings;
  vm.dbWeekStandingsData = MatchupService.dbWeekStandingsData; 
  vm.dbWeekMatchupDataSpreads = MatchupService.dbWeekMatchupDataSpreads;
  vm.getWeekMatchupsSpreads = MatchupService.getWeekMatchupsSpreads;



  vm.getUserPicks();



}]);