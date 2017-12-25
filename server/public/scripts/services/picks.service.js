myApp.service('PickService', function($http, $location){
    console.log('PickService Loaded');
    var vm = this;
    vm.dbMatchupData = { list: [] };
    vm.selectedWeek = {};
    vm.dbWeekMatchupData = { list: [] };
    vm.newPick = {};


    vm.getWeekMatchups = function (selectedWeek) {
        console.log('in getWeekMatchups', selectedWeek);
        $http({
            method: 'POST',
            url: '/picks',
            data: selectedWeek
        }).then(function (response) {
            vm.dbMatchupData.list = response.data;
            console.log('getting back from DB', vm.dbWeekMatchupData.list);
        });
    };//end gets weeks matchups

    vm.getAllMatchupData = function () {
        $http({
            method: 'GET',
            url: '/picks'
        }).then(function (response) {
            vm.dbMatchupData.list = response.data;
            console.log('getting back from DB', vm.dbMatchupData.list);
        });
    };//end get all matchup data


    vm.postPicks = function (newPick) {
        console.log('in getWeekMatchups', selectedWeek);
        $http({
            method: 'POST',
            url: '/picks/post',
            data: newPick
        }).then(function (response) {
            console.log('response', response);
        });
    };//end gets weeks matchups
   



}); //end service