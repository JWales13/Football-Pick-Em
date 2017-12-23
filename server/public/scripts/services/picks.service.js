myApp.service('PickService', function($http, $location){
    console.log('PickService Loaded');
    var vm = this;
    vm.dbMatchupData = { list: [] };
    vm.selectedWeek = '';


    vm.getWeekMatchups = function (selectedWeek) {
        console.log('in getWeekMatchups')
        $http({
            method: 'GET',
            url: '/picks',
        }).then(function (response) {
            vm.dbMatchupData.list = response.data;
            console.log('getting back from DB', vm.dbMatchupData.list);
        });
    };//end gets weeks matchups
   



}); //end service