myApp.service('MatchupService', function ($http, $location) {
    console.log('MatchupService Loaded');
    var vm = this;
    vm.matchupData = { list: [] };
    vm.newMatchup = {};
    vm.selectedWeek = {};
    vm.dbWeekMatchupData = { list: [] };
    vm.newSpread = {};
    vm.dbWeekMatchDataWinners = { list: [] };
    vm.standingsData = { list: [] };
    vm.userPickData = { list: [] };
    vm.usersData = { list: [] };
    vm.dbWeekStandingsData = { list: [] };
    vm.dbWeekMatchupDataSpreads = { list: [] };





    vm.players = [
        {
            userID: 1,
            userName: 'Joe',
            pointTotal: 0,
            pointTotalWeek: 0
        },
        {
            userID: 2,
            userName: 'Nathan',
            pointTotal: 0,
            pointTotalWeek: 0
        },
        {
            userID: 3,
            userName: 'Jim',
            pointTotal: 0,
            pointTotalWeek: 0
        },
        {
            userID: 4,
            userName: 'Scott',
            pointTotal: 0,
            pointTotalWeek: 0
        },
        {
            userID: 5,
            userName: 'Laura',
            pointTotal: 0,
            pointTotalWeek: 0
        },
     

    ];



    vm.getMatchups = function () {
        $http({
            method: 'GET',
            url: '/matchups',
        }).then(function (response) {
            vm.matchupData.list = response.data;
        });
    };//end get matchups




    vm.populateDB = function (taco) {
        console.log('in populateDb')
        angular.forEach(vm.matchupData.list.weeks, function (week, key) {
            angular.forEach(week.games, function (game, key) {

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
        }) //end then
    } //end post


    vm.addSpread = function (newSpread) {
        $http({
            method: 'PUT',
            url: '/matchups/spread', 
            data: newSpread
        }).then(function (response) {
            vm.newSpread.id = '';
            vm.newSpread.home_team_spread = '';
        });
    };//end addSpread  


    vm.getWeekMatchups = function (selectedWeek) {
        $http({
            method: 'POST',
            url: '/picks',
            data: selectedWeek
        }).then(function (response) {
            vm.dbWeekMatchupData.list = response.data;
            vm.dbWeekMatchupDataSpreads.list = response.data;
        });
    };//end gets weeks matchups

    vm.getWeekMatchupsSpreads = function (selectedWeek) {
        $http({
            method: 'POST',
            url: '/picks',
            data: selectedWeek
        }).then(function (response) {
            vm.dbWeekMatchupDataSpreads.list = response.data;
        });
    };//end gets weeks matchups


    vm.calcWeekWinners = function (selectedWeek) {
        $http({
            method: 'POST',
            url: '/matchups/winners',
            data: selectedWeek
        }).then(function (response) {
            vm.dbWeekMatchDataWinners.list = response.data;

            angular.forEach(vm.dbWeekMatchDataWinners.list, function (game, key) {
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
                    })
                }//end else
            }) //end for each winners  
        });//end .then for calcWinners
    };//end calc winners

    vm.seasonStandings = function () {
        $http({
            method: 'GET',
            url: '/matchups/standings',
        }).then(function (response) {
            vm.standingsData.list = response.data;
            console.log('standings data:',vm.standingsData.list)
            vm.standingsFunction();
        });
    };//end get matchups


    ``


    vm.standingsFunction = function () {
        var right = 0;
        var wrong = 0;
        for (var i = 0; i < vm.standingsData.list.length; i++) {

            var users = vm.standingsData.list[i].id;
            var team = vm.standingsData.list[i].team;
            var winner = vm.standingsData.list[i].winner_id;
            for (var j = 0; j < team.length; j++) {


                if (team[j] == winner) {
                    ++right;
                }//end if
                else if (winner == null) {

                }//end else if
                else {
                    ++wrong
                }//end else



            }//end team for loop

            for (var u = 0; u < users.length; u++) {
                var user = users[u];
                var currentTeam = vm.standingsData.list[i].team[u];
                vm.findPlayer(user, currentTeam, winner, right, wrong);
            }//end user for loop


            var right = 0;
            var wrong = 0;

        }//end first for loop

    }//end standings function



    vm.findPlayer = function (user, currentTeam, winner, right, wrong) {
        for (var k = 0; k < vm.players.length; k++) {

            


            if (vm.players[k].userID === user && currentTeam === winner) {
                vm.players[k].pointTotal = (vm.players[k].pointTotal + wrong);
            }//end if
            else if (vm.players[k].userID === user && currentTeam != winner) {
                vm.players[k].pointTotal = (vm.players[k].pointTotal - right);
            }//end elseif

        }//end player for loop
    }//end find player







    vm.getUserPicks = function () {
        $http({
            method: 'GET',
            url: '/matchups/user-picks',
        }).then(function (response) {
            vm.userPickData.list = response.data;
        });
    }//end user picks



    vm.getWeekMatchupsPicks = function (selectedWeek) {
        $http({
            method: 'POST',
            url: '/picks',
            data: selectedWeek
        }).then(function (response) {
            vm.dbWeekMatchupData.list = response.data;
        });
    };//end gets weeks matchups

    vm.getUsers = function () {
        $http({
            method: 'GET',
            url: '/matchups/users',
        }).then(function (response) {
            vm.usersData.list = response.data;
        });
    }//end get users


    vm.deleteUser = function (userToDelete) {
        $http({
            method: 'DELETE',
            url: '/matchups/users/' + userToDelete.id,
        }).then(function (response) {
            vm.getUsers();
        })
    }//end deleteUser


    vm.getWeekStandings = function (selectedWeek) {
        console.log("in getWeekStandimgs");
        $http({
            method: 'POST',
            url: '/matchups/weekStandings',
            data: selectedWeek
        }).then(function (response) {
            vm.dbWeekStandingsData.list = response.data;
            console.log("standings data for week:", selectedWeek, "data:", vm.dbWeekStandingsData.list );
            for (var k = 0; k < vm.players.length; k++) {
                vm.players[k].pointTotalWeek = 0;
            }
            vm.weekStandingsFunction();
        });
    };//end gets weeks standings

    vm.weekStandingsFunction = function () {
        var right = 0;
        var wrong = 0;
        for (var i = 0; i < vm.dbWeekStandingsData.list.length; i++) {

            var users = vm.dbWeekStandingsData.list[i].id;
            var team = vm.dbWeekStandingsData.list[i].team;
            var winner = vm.dbWeekStandingsData.list[i].winner_id;
            for (var j = 0; j < team.length; j++) {


                if (team[j] == winner) {
                    ++right;
                }//end if
                else if (winner == null) {

                }//end else if
                else {
                    ++wrong
                }//end else



            }//end team for loop

            for (var u = 0; u < users.length; u++) {
                var user = users[u];
                var currentTeam = vm.dbWeekStandingsData.list[i].team[u];
                vm.findPlayerForWeek(user, currentTeam, winner, right, wrong);
            }//end user for loop


            var right = 0;
            var wrong = 0;

        }//end first for loop

    }//end standings function


    vm.findPlayerForWeek = function (user, currentTeam, winner, right, wrong) {
        for (var k = 0; k < vm.players.length; k++) {

            if (vm.players[k].userID === user && currentTeam === winner) {
                vm.players[k].pointTotalWeek = (vm.players[k].pointTotalWeek + wrong);
            }//end if
            else if (vm.players[k].userID === user && currentTeam != winner) {
                vm.players[k].pointTotalWeek = (vm.players[k].pointTotalWeek - right);
            }//end elseif

        }//end player for loop
    }//end find player



    vm.seasonStandings();


}); //end service






                    // sql statement that comes back as string

                    // SELECT picks.matchup, matchup.winner_id, array_agg((picks.team, picks.user, users.username))
                    // FROM picks
                    // INNER JOIN users ON picks.user = users.id
                    // INNER JOIN matchup ON picks.matchup = matchup.id
                    // GROUP BY picks.matchup, matchup.winner_id;


                    // sql statement with 3 arrays per matchup
                    // SELECT picks.matchup, matchup.winner_id, array_agg((picks.team)) as team,  array_agg(users.id) as id, array_agg(users.username) as username
                    // FROM picks
                    // INNER JOIN users ON picks.user = users.id
                    // INNER JOIN matchup ON picks.matchup = matchup.id
                    // GROUP BY picks.matchup, matchup.winner_id;



                    // new sql statement for getUserPicks

                    // SELECT  picks.matchup, array_agg(users.username) as username, array_agg(picks.user) as user, array_agg(picks.team) as team, array_agg(team.name)as teamname
                    // FROM users
                    // INNER JOIN picks ON picks.user = users.id
                    // INNER JOIN team on team.id = picks.team
                    // GROUP BY picks.matchup;





                // original sql statement for getUserPicks

                // SELECT users.id, users.username, picks.user, picks.team, picks.matchup, team.name
                // FROM users
                // INNER JOIN picks ON picks.user = users.id
                // INNER JOIN team on team.id = picks.team;