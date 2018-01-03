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

    // vm.getAllMatchupData = function () {
    //     $http({
    //         method: 'GET',
    //         url: '/picks'
    //     }).then(function (response) {
    //         vm.dbAllMatchupData.list = response.data;
    //         console.log('getting back from DB', vm.dbAllMatchupData.list);
    //     });
    // };//end get all matchup data


    vm.postPick = function (newPick) {
        console.log('in postPicks', newPick);
        $http({
            method: 'POST',
            url: '/picks/post',
            data: newPick
        }).then(function (response) {
            console.log('response', response);
        });
    };//end postPick


   



}); //end service