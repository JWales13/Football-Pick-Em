myApp.service('PickService', function($http, $location){
    console.log('PickService Loaded');
    var vm = this;
    // vm.dbMatchupData = { list: [] };
    vm.selectedWeek = {};
    vm.dbWeekMatchupData = { list: [] };
    vm.newPick = {};
    // vm.dbAllMatchupData = { list: [] };



    vm.getWeekMatchups = function (selectedWeek) {
        console.log('in getWeekMatchups', selectedWeek);
        $http({
            method: 'POST',
            url: '/picks',
            data: selectedWeek
        }).then(function (response) {
            vm.dbWeekMatchupData.list = response.data;
            console.log('got matchups', vm.dbWeekMatchupData.list);
        });
    };//end gets weeks matchups




    vm.postPick = function (gamePicked) {
        console.log('in postPicks', gamePicked);
        $http({
            method: 'POST',
            url: '/picks/post' + gamePicked.id,
            data: gamePicked
        }).then(function (response) {
            console.log('response', response);
        });
    };//end postPick


   



}); //end service