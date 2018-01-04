myApp.service('MatchupService', function($http, $location){
    console.log('MatchupService Loaded');
    var vm = this;
    vm.matchupData = { list: [] };
    vm.newMatchup = {};
    vm.selectedWeek = {};
    vm.dbWeekMatchupData = { list: [] };
    vm.newSpread = {};
    vm.dbWeekMatchDataWinners = { list: [] };
    


    vm.getMatchups = function () {
        $http({
            method: 'GET',
            url: '/matchups',
        }).then(function (response) {
            vm.matchupData.list = response.data;
            console.log('data ', vm.matchupData.list.weeks);
        });
    };//end get matchups




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


    vm.addSpread = function (newSpread) {
        console.log('in addSpread', newSpread);
        $http({
            method: 'PUT',
            url: '/matchups/spread', /*+ newSpread.id,*/
            data: newSpread
        }).then(function (response) {
            console.log('response', response);
            // vm.getWeekMatchups();
            vm.newSpread.id = '';
            vm.newSpread.home_team_spread = '';
        });
    };//end addSpread  


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


    vm.calcWeekWinners = function (selectedWeek) {
        console.log('in calcWinners', selectedWeek);
        $http({
            method: 'POST',
            url: '/matchups/winners',
            data: selectedWeek
        }).then(function (response) {
            vm.dbWeekMatchDataWinners.list = response.data;
            console.log('got matchups for winners calc', vm.dbWeekMatchDataWinners.list);
        
        angular.forEach (vm.dbWeekMatchDataWinners.list, function(game,key){
            if ((game.home_points + parseInt(game.home_team_spread)) > (game.away_points)) {
                winnerObject = {
                    id: game.id,
                    winner_id: game.home
                }
                $http({
                            method: 'PUT',
                            url: '/matchups/winners',
                            data: winnerObject
                        }).then(function (response) {
                            console.log('home team beat the spread');
                        })
            }//end if
            else if ((game.home_points + parseInt(game.home_team_spread)) < (game.away_points)) {
                winnerObject = {
                    id: game.id,
                    winner_id: game.away
                }
                $http({
                    method: 'PUT',
                    url: '/matchups/winners',
                    data: winnerObject
                }).then(function (response) {
                    console.log('away team beat the spread');
                })
            }//end else if
            else {
                winnerObject = {
                    id: game.id,
                    winner_id: null
                }
                $http({
                    method: 'PUT',
                    url: '/matchups/winners',
                    data: winnerObject
                }).then(function (response) {
                    console.log('this was a push');
                })
            }//end else
        }) //end for each winners  
        
    });//end .then for calcWinners
        
    };//end calc winners


   

}); //end service



