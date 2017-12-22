myApp.service('MatchupService', function($http, $location){
    console.log('MatchupService Loaded');
    var vm = this;
    vm.matchupData = { list: [] };
    vm.newMatchup = {};





    vm.getMatchups = function () {
        $http({
            method: 'GET',
            url: '/matchups',
        }).then(function (response) {
            vm.matchupData.list = response.data;
            console.log('data ', vm.matchupData.list.weeks);
        });
    }




    vm.populateDB = function (taco) {
        console.log('in populateDb')
        angular.forEach(vm.matchupData.list.weeks, function (week, key) {
            // console.log('in first for loop, here are week numbers:', week.title);
            angular.forEach(week.games, function (game, key) {
                // console.log('home team:', game.home.name);

                if (game.status == "postponed") {
                    console.log('game postponed')
                    newMatchup = {
                        id: game.number,
                        home: game.home.name,
                        away: game.away.name,
                        date: game.scheduled,
                        week: week.sequence,
                        home_points: 0,
                        away_points: 0,
                    };
                }
                else if (game.status == "scheduled") {
                    console.log('game has not been played')
                    newMatchup = {
                        id: game.number,
                        home: game.home.name,
                        away: game.away.name,
                        date: game.scheduled,
                        week: week.sequence,
                        home_points: 0,
                        away_points: 0,
                    };
                    vm.innerFunction(newMatchup);
                } //end else if
                else {
                    newMatchup = {
                        id: game.number,
                        home: game.home.name,
                        away: game.away.name,
                        date: game.scheduled,
                        week: week.sequence,
                        home_points: game.scoring.home_points,
                        away_points: game.scoring.away_points,
                    };
                    console.log(newMatchup);
                    vm.innerFunction(newMatchup);
                };//end else

            })//end 2nd for each

        })//end first for each
    }//end populateDB


    vm.innerFunction = function (newMatchup) {
        $http({
            method: 'POST',
            url: '/matchups',
            data: newMatchup
        }).then(function (response) {
            console.log(response)
        }) //end then
    } //end post

    vm.getMatchups();
    // vm.populateDB(vm.matchupData.list.weeks);

});