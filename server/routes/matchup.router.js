var express = require('express');
var router = express.Router();
var request = require('request');
var pool = require('../modules/pool');

router.get('/', function (req, res) {
    var fullRequestUrl = 'http://api.sportradar.us/nfl-ot2/games/2017/REG/schedule.json?api_key=qc6kyztktpmnnfu9dgkedssf'
    var headers = 'X-Originating-Ip : 174.53.198.56';
    request(fullRequestUrl, headers, function (error, response, body) {
        if (error) {
            console.log('Error making Request', error);
            res.sendStatus(500);
        } else {
            res.send(body);
        }
    });
});

router.post('/', function (req, res) {
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('error connecting to DB', errorConnectingToDatabase);
            res.sendStatus(500);
        }
        else {

            client.query(`INSERT INTO matchup (id, home, away, date, week, home_points, away_points)
            VALUES ($1, (SELECT team.id FROM team WHERE team.name = $2), (SELECT team.id FROM team WHERE team.name = $3), $4, $5, $6, $7);`, [req.body.id, req.body.home, req.body.away, req.body.date, req.body.week, req.body.home_points, req.body.away_points], function (errorMakingQuery, result) {
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


router.put('/spread', function (req, res) {
    var newSpreadId = req.body.id;
    var newSpread = req.body.home_team_spread;
    console.log('spread:', newSpread);
    console.log('id:', newSpreadId);
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('error', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {

            client.query(`UPDATE matchup SET home_team_spread = $1 WHERE matchup.id = $2`, [newSpread, newSpreadId],
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

router.post('/winners', function (req, res) {
    selectedWeek = req.body;
    console.log('selectedWeek.week:', selectedWeek.week);
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('error', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            console.log('selectedWeek:', selectedWeek)
            client.query(`SELECT * FROM matchup WHERE week = $1`, [selectedWeek.week],
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


router.put('/winners', function (req, res) {
    newWinner = req.body.winner_id;
    newWinnerId = req.body.id;
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('error', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {

            client.query(`UPDATE matchup SET winner_id = $1 WHERE matchup.id = $2`, [newWinner, newWinnerId],
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


router.get('/standings', function (req, res) {


    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('error', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {

            client.query(`SELECT picks.matchup, matchup.winner_id, array_agg((picks.team)) as team,  array_agg(users.id) as id, array_agg(users.username) as username
            FROM picks
            INNER JOIN users ON picks.user = users.id
            INNER JOIN matchup ON picks.matchup = matchup.id
            GROUP BY picks.matchup, matchup.winner_id;`,
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



router.get('/user-picks', function (req, res) {


    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('error', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {

            client.query(`SELECT users.id, users.username, picks.user, picks.team, picks.matchup, team.name
            FROM users
            INNER JOIN picks ON picks.user = users.id
            INNER JOIN team on team.id = picks.team;`,
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


router.get('/users', function (req, res) {

    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('error', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {

            client.query(`SELECT username, id FROM users`,
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

router.delete('/users/:id', function (req, res) {
    var userIdToRemove = req.params.id;
    console.log("userToDelete:", userIdToRemove);
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            client.query(`DELETE FROM users WHERE id=$1;`, [userIdToRemove], function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
});


module.exports = router;