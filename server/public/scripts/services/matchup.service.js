myApp.service('MatchupService', function($http, $location){
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
  
    
    
    vm.players = [
        {
            userID: 1,
            userName: 'player1',
            pointTotal: 0
        },
        {
            userID: 2,
            userName: 'player2',
            pointTotal: 0
        },
        {
            userID: 3,
            userName: 'player3',
            pointTotal: 0
        },
        {
            userID: 4,
            userName: 'player4',
            pointTotal: 0
        },
        {
            userID: 5,
            userName: 'player5',
            pointTotal: 0
        },
       
    ];
    


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

    vm.seasonStandings = function () {
        console.log('in seasonStandings')
        $http({
            method: 'GET',
            url: '/matchups/standings',
        }).then(function (response) {
            vm.standingsData.list = response.data;
            console.log('standingsData ', vm.standingsData.list);
          
        
            vm.standingsFunction();
        });
    };//end get matchups


``


   vm.standingsFunction = function(){
    var right = 0;
    var wrong = 0;
       for(var i = 0; i < vm.standingsData.list.length; i++){
           console.log('in first standings for loop');
           var users = vm.standingsData.list[i].id;
           var team = vm.standingsData.list[i].team;
           var winner = vm.standingsData.list[i].winner_id;
           for(var j = 0; j < team.length; j++){
                
               console.log('in 2nd standings for loop');
               if(team[j] == winner){
                   ++right;
               }//end if
               else if(winner == null) {
                   console.log('no bet');
               }//end else if
               else {
                   ++wrong
               }//end else
               
               console.log('right:', right, 'wrong:', wrong);

           }//end team for loop

           for(var u = 0; u < users.length; u++){
            var user = users[u];
            var currentTeam = vm.standingsData.list[i].team[u];
            vm.findPlayer(user,currentTeam, winner, right, wrong);
           }//end user for loop
           
            console.log('player + scores',vm.players);
            var right = 0;
            var wrong = 0;
           
       }//end first for loop
       console.log('player + scores',vm.players);
   }//end first function

//    function matchupIterator(matchup) {
//        var cleanedMatchup = [];
//         for(var i = 0; i < matchup.username.length; i++) {
//             cleanedMatchup = 
//         }
//    }

   vm.findPlayer = function(user,currentTeam, winner, right, wrong){
       for(var k = 0; k < vm.players.length; k++){
        
            
                if(vm.players[k].userID === user && currentTeam === winner){
                    vm.players[k].pointTotal = (vm.players[k].pointTotal  + wrong);
                }//end if
                else if(vm.players[k].userID === user && currentTeam != winner){
                    vm.players[k].pointTotal = (vm.players[k].pointTotal - right);
                }//end elseif
                else{
                    console.log('not the right player');
                }
            
          
       }//end player for loop
   }//end find player







   vm.getUserPicks = function() {
    console.log('in getUserPicks')
    $http({
        method: 'GET',
        url: '/matchups/user-picks',
    }).then(function (response) {
        vm.userPickData.list = response.data;
        console.log('userPickData ', vm.userPickData.list);
        
    });
   }//end user picks



   vm.getWeekMatchupsPicks = function (selectedWeek) {
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