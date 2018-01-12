myApp.service('PickService', function ($http, $location) {
    console.log('PickService Loaded');
    var vm = this;
    vm.selectedWeek = {};
    vm.dbWeekMatchupData = { list: [] };
    vm.newPick = {};



    vm.getWeekMatchups = function (selectedWeek) {
        $http({
            method: 'POST',
            url: '/picks',
            data: selectedWeek
        }).then(function (response) {
            vm.dbWeekMatchupData.list = response.data;
        });
    };//end get weeks matchups




    vm.postPick = function (gamePicked) {
        $http({
            method: 'POST',
            url: '/picks/post' + gamePicked.id,
            data: gamePicked
        }).then(function (response) {
        });
    };//end postPick






}); //end service