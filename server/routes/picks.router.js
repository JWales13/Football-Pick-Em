var express = require('express');
var router = express.Router();
var request = require('request');
var pool = require('../modules/pool');


router.post('/', function (req, res) {
    selectedWeek = req.body;
    console.log('selectedWeek.week:', selectedWeek.week);
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('error', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            console.log('selectedWeek:', selectedWeek)
            client.query(`SELECT home_team_spread, date, t1.name as home, t2.name as away, t.id FROM matchup t
            INNER JOIN team t1 on t.home = t1.id
            INNER JOIN team t2 on t.away = t2.id
            WHERE t.week = $1;`, [selectedWeek.week],
                function (errorMakingDatabaseQuery, result) {
                    done();
                    if (errorMakingDatabaseQuery) {
                        console.log('error', errorMakingDatabaseQuery);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows);
                    }
                });
        }
    });
});




router.post('/post:id', function (req, res) {
    var newPick = {};
    newPick.user = req.user.id;
    newPick.matchup = req.params.id;
    newPick.team = req.body.newPick;


    console.log('user:', newPick.user);
    console.log('matchup:', newPick.matchup);
    console.log('team:', newPick.team);


    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('error connecting to DB', errorConnectingToDatabase);
            res.sendStatus(500);
        }
        else {

            client.query(`INSERT INTO picks ( "team", "matchup", "user")
            SELECT team.id as teamPick, $2, $3 FROM team WHERE team.name = $1`,
                [newPick.team, newPick.matchup, newPick.user], function (errorMakingQuery, result) {
                    done();
                    if (errorMakingQuery) {
                        console.log('error making query', errorMakingQuery);
                        res.sendStatus(500);
                    }
                    else {
                        res.sendStatus(201);
                    }//end  query else
                });//end client query
        }//end connect else
    });//end pool connect
})//end router post








module.exports = router;